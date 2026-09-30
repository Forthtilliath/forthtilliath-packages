# @forthtilliath/r2

## 0.2.0

### Minor Changes

- 1cdc39e: `uploadViaPresignedUrl` takes an optional `onProgress({ loaded, total })` callback for upload progress bars: the `PUT` then goes through `XMLHttpRequest` (`fetch` can't report upload progress), still cancellable with `signal`. Without it, nothing changes.
- f3c3000: Harden the presign route:

  - The `Content-Type` is now part of the presigned URL's signature: a URL obtained for `image/webp` can no longer be used to upload `text/html`.
  - On a public bucket (`publicBaseUrl` set), active content types a browser renders or executes (HTML, SVG, XML, JavaScript — exported as `ACTIVE_CONTENT_TYPES`) are rejected with a `415` by default, to prevent stored XSS. **Behavior change** if you served such files from a public bucket: allow them explicitly with `allowedContentTypes`.
  - New options: `allowedContentTypes` (exact or `"image/*"` wildcards, `415` otherwise) and `maxSizeBytes` (`413` above it; the exact size is signed into the URL).
  - `authorize(key, { request, contentType, size })` now receives the request, to identify the caller — existing `authorize(key)` callbacks keep working.
  - `isSafeKey` also rejects backslashes, control characters and keys over 1024 bytes; malformed content types get a `400`; `publicUrl` URL-encodes each key segment.
  - Client: `uploadViaPresignedUrl` sends the file's `size` and accepts a `signal` to cancel the upload.

### Patch Changes

- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.

## 0.1.0

### Minor Changes

- 9d0e8c6: New package `@forthtilliath/r2`: direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible storage) via presigned URLs — `uploadViaPresignedUrl` (`./client`, dependency-free), `createR2Client`, `createPresignHandler` (a Fetch API `Request → Response` route handler with an `authorize` hook) and `isSafeKey` (`./server`, AWS SDK as peer dependencies), plus the shared `PresignRequest`/`PresignResponse` types at the root. Extracted from the Chœur des Anjoués site. `ts-kit` gains an `image` category with `compressImage` (browser-side Canvas resize + WebP conversion), extracted from the same project.
