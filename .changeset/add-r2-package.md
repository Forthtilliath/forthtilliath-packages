---
"@forthtilliath/r2": minor
"@forthtilliath/ts-kit": minor
---

New package `@forthtilliath/r2`: direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible storage) via presigned URLs — `uploadViaPresignedUrl` (`./client`, dependency-free), `createR2Client`, `createPresignHandler` (a Fetch API `Request → Response` route handler with an `authorize` hook) and `isSafeKey` (`./server`, AWS SDK as peer dependencies), plus the shared `PresignRequest`/`PresignResponse` types at the root. Extracted from the Chœur des Anjoués site. `ts-kit` gains an `image` category with `compressImage` (browser-side Canvas resize + WebP conversion), extracted from the same project.
