---
"@forthtilliath/expo-test-kit": minor
---

**Breaking:** `src/` is now organized by config instead of flat files, so deep imports moved: `createTestDb`, `closeTestDb`, `resetTestDb` and `mockDbClient` are now under `@forthtilliath/expo-test-kit/sqlite/*`, and `createFakeExpoFileSystem` is now under `@forthtilliath/expo-test-kit/file-system/createFakeExpoFileSystem`. Prepares room for a future DB config (e.g. Postgres) alongside `sqlite/` without remixing files. No behavior change.
