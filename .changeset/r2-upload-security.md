---
"@forthtilliath/r2": minor
---

Harden the presign route:

- The `Content-Type` is now part of the presigned URL's signature: a URL obtained for `image/webp` can no longer be used to upload `text/html`.
- On a public bucket (`publicBaseUrl` set), active content types a browser renders or executes (HTML, SVG, XML, JavaScript — exported as `ACTIVE_CONTENT_TYPES`) are rejected with a `415` by default, to prevent stored XSS. **Behavior change** if you served such files from a public bucket: allow them explicitly with `allowedContentTypes`.
- New options: `allowedContentTypes` (exact or `"image/*"` wildcards, `415` otherwise) and `maxSizeBytes` (`413` above it; the exact size is signed into the URL).
- `authorize(key, { request, contentType, size })` now receives the request, to identify the caller — existing `authorize(key)` callbacks keep working.
- `isSafeKey` also rejects backslashes, control characters and keys over 1024 bytes; malformed content types get a `400`; `publicUrl` URL-encodes each key segment.
- Client: `uploadViaPresignedUrl` sends the file's `size` and accepts a `signal` to cancel the upload.
