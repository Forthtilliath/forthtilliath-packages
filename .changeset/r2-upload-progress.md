---
"@forthtilliath/r2": minor
---

`uploadViaPresignedUrl` takes an optional `onProgress({ loaded, total })` callback for upload progress bars: the `PUT` then goes through `XMLHttpRequest` (`fetch` can't report upload progress), still cancellable with `signal`. Without it, nothing changes.
