---
"@forthtilliath/ts-kit": minor
---

Added `randomId` (`crypto.randomUUID()` with a fallback for older/insecure contexts). `downloadTextBlob` now accepts an optional `mimeType` parameter (defaults to `"text/plain"`) and appends `;charset=utf-8` to the blob type.
