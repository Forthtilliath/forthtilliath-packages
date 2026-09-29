# @forthtilliath/r2

Direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible
storage) via presigned URLs. The file never goes through your app server — handy
on Vercel, whose functions reject request bodies over 4.5 MB.

```
browser ──POST { key, contentType, size }──▶ your presign route ──▶ { uploadUrl, publicUrl? }
browser ──PUT file──────────────────▶ bucket (uploadUrl)
```

## Install

```bash
npm install @forthtilliath/r2 @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

The AWS SDK packages are peer dependencies, only loaded by the `./server`
entry point. `./client` has no dependency at all.

| Entry point                | Runs in | Exports                                                                       |
| -------------------------- | ------- | ----------------------------------------------------------------------------- |
| `@forthtilliath/r2`        | —       | Types: `PresignRequest`, `PresignResponse`, `PublicPresignResponse`           |
| `@forthtilliath/r2/client` | Browser | `uploadViaPresignedUrl`                                                       |
| `@forthtilliath/r2/server` | Server  | `createR2Client`, `createPresignHandler`, `isSafeKey`, `ACTIVE_CONTENT_TYPES` |

## Usage

### Server — client and presign route

```ts
// lib/r2.ts
import { createR2Client } from "@forthtilliath/r2/server";

export const r2 = createR2Client({
  endpoint: process.env.R2_ENDPOINT!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
});
```

`createR2Client` disables the SDK's automatic checksums
(`requestChecksumCalculation: "WHEN_REQUIRED"`): R2 rejects the
`x-amz-checksum-*` parameters in presigned PUTs sent by a browser.

```ts
// app/api/r2/presign-upload/route.ts (Next.js route handler)
import { createPresignHandler } from "@forthtilliath/r2/server";

export const POST = createPresignHandler({
  client: r2,
  bucket: "my-public-bucket",
  publicBaseUrl: "https://cdn.example.com", // omit for a private bucket
  allowedContentTypes: ["image/*", "application/pdf"], // optional
  maxSizeBytes: 10 * 1024 * 1024, // optional
  authorize: async (key, { request, contentType, size }) => {
    const user = await getUser(request);
    if (!user) return { status: 401, error: "Unauthorized" };
    if (!key.startsWith(`users/${user.id}/`))
      return { status: 403, error: "Forbidden key" };
    return null;
  },
});
```

`createPresignHandler` returns a standard `(Request) => Promise<Response>`
handler, so it works with any framework built on the Fetch API. It:

1. reads `{ key, contentType, size? }` — `400` if `key` or `contentType` is
   missing;
2. rejects unsafe keys (`..`, leading `/`, backslash, control characters,
   over 1024 bytes) and malformed content types — `400`;
3. checks the content type — `415` (see [Security](#security));
4. with `maxSizeBytes`, checks `size` — `400` if missing/invalid, `413` above
   the limit;
5. calls `authorize(key, { request, contentType, size })` — a returned
   `{ status, error }` is sent as-is. Steps 2–4 run first, so an invalid
   request never reaches your auth logic;
6. responds with `{ uploadUrl }`, plus `publicUrl` (key segments
   URL-encoded) when `publicBaseUrl` is set.

Options:

- `allowedContentTypes` — exact types or wildcards (`"image/*"`); anything
  else gets a `415`. Replaces the default rule below.
- `maxSizeBytes` — max file size; the client must send `size` (the bundled
  client does), and it is signed into the URL.
- `expiresIn` — URL lifetime in seconds (default `300`).
- `onError(error) => Response` — for presign failures (default: logs and
  returns `500`).

### Browser — upload

```ts
import { uploadViaPresignedUrl } from "@forthtilliath/r2/client";
import type { PublicPresignResponse } from "@forthtilliath/r2";
import { compressImage } from "@forthtilliath/ts-kit";

const { publicUrl } = await uploadViaPresignedUrl<PublicPresignResponse>({
  file,
  key: `users/${userId}/avatar.webp`,
  endpoint: "/api/r2/presign-upload",
  transform: compressImage, // optional
});
```

Throws with the route's `error` message when presigning fails, or
`Upload failed (<status>)` when the `PUT` fails. Pass `signal` (an
`AbortSignal`) to cancel both requests.

For a progress bar, pass `onProgress` — the `PUT` then goes through
`XMLHttpRequest` (`fetch` doesn't report upload progress); it ends on 100%
once the upload succeeds:

```ts
await uploadViaPresignedUrl({
  file,
  key,
  endpoint: "/api/r2/presign-upload",
  onProgress: ({ loaded, total }) => {
    setPercent(Math.round((loaded / total) * 100));
  },
});
```

## Security

- **The Content-Type is signed.** The presigned URL only accepts a `PUT`
  with the exact `Content-Type` that was presigned, so a client can't get a
  URL for `image/webp` and upload `text/html` with it.
- **Active content is refused on public buckets.** Without
  `allowedContentTypes`, a public bucket (`publicBaseUrl` set) rejects the
  types a browser renders or executes (`ACTIVE_CONTENT_TYPES`: HTML, SVG,
  XML, JavaScript) — served from the bucket, they'd be a stored XSS. A
  private bucket accepts any type by default. Prefer an explicit
  `allowedContentTypes` whenever you know what you accept.
- **Size is only enforced with `maxSizeBytes`.** The exact size is then
  signed into the URL: the bucket rejects a body of any other length.
- **`authorize` is your access control.** It gets the `Request`, so check the
  caller's session there, and restrict the key (e.g. to the user's own
  prefix) — the key check only blocks path tricks, not someone else's key.

## Bucket CORS

Direct uploads need a CORS rule on the bucket allowing `PUT` with the
`content-type` header from your site's origin:

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type"]
  }
]
```

If your site sends a Content-Security-Policy, `connect-src` must also allow
the bucket's upload host (e.g. `https://*.r2.cloudflarestorage.com`).

## Scripts

```bash
pnpm run build          # tsc -> dist/ (excludes *.test.ts)
pnpm run check-types    # tsc --noEmit, includes test files
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run coverage       # vitest run --coverage
```
