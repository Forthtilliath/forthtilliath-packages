---
"@forthtilliath/expo-test-kit": minor
---

`createFakeExpoFileSystem` gains `Directory` (`exists`, `create`, `delete`), `File#textSync`, a `failWrites` flag simulating a full disk, `reset()`, and `documentUri` / `cacheUri` options for full `Paths` URIs (`file:///documents`). Parts are now joined without doubling a trailing `/`.
