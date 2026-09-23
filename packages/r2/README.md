# @forthtilliath/r2

Direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible
storage) via presigned URLs. The file never goes through your app server — handy
on Vercel, whose functions reject request bodies over 4.5 MB.

```
browser ──POST { key, contentType }──▶ your presign route ──▶ { uploadUrl, publicUrl? }
browser ──PUT file──────────────────▶ bucket (uploadUrl)
```

## Install

```bash
npm install @forthtilliath/r2 @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

The AWS SDK packages are peer dependencies, only loaded by the `./server`
entry point. `./client` has no dependency at all.

| Entry point                | Runs in | Exports                                                             |
| -------------------------- | ------- | ------------------------------------------------------------------- |
| `@forthtilliath/r2`        | —       | Types: `PresignRequest`, `PresignResponse`, `PublicPresignResponse` |
| `@forthtilliath/r2/client` | Browser | `uploadViaPresignedUrl`                                             |
| `@forthtilliath/r2/server` | Server  | `createR2Client`, `createPresignHandler`, `isSafeKey`               |

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
  authorize: async (key) => {
    const user = await getUser();
    if (!user) return { status: 401, error: "Unauthorized" };
    if (!key.startsWith(`users/${user.id}/`))
      return { status: 403, error: "Forbidden key" };
    return null;
  },
});
```

`createPresignHandler` returns a standard `(Request) => Promise<Response>`
handler, so it works with any framework built on the Fetch API. It:

1. reads `{ key, contentType }` — `400` if either is missing;
2. rejects unsafe keys (`..`, leading `/`, null byte) — `400`, before
   `authorize` is called;
3. calls `authorize(key)` — a returned `{ status, error }` is sent as-is;
4. responds with `{ uploadUrl }`, plus `publicUrl` when `publicBaseUrl` is
   set.

Options: `expiresIn` (seconds, default `300`) and `onError(error) => Response`
for presign failures (default: logs and returns `500`).

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
`Upload failed (<status>)` when the `PUT` fails.

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
