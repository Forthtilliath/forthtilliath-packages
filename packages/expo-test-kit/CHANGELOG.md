# @forthtilliath/expo-test-kit

## 0.3.0

### Minor Changes

- 56d8944: **Breaking:** `src/` is now organized by config instead of flat files, so deep imports moved: `createTestDb`, `closeTestDb`, `resetTestDb` and `mockDbClient` are now under `@forthtilliath/expo-test-kit/sqlite/*`, and `createFakeExpoFileSystem` is now under `@forthtilliath/expo-test-kit/file-system/createFakeExpoFileSystem`. Prepares room for a future DB config (e.g. Postgres) alongside `sqlite/` without remixing files. No behavior change.

## 0.2.0

### Minor Changes

- 657d63e: First public release. `createTestDb`/`closeTestDb`/`resetTestDb` for a real in-memory SQLite database (via libsql) with Drizzle migrations replayed, `mockDbClient` to swap it in for a repository's real client, and `createFakeExpoFileSystem`/`getFakeExpoFileSystem` for a minimal `expo-file-system` fake.
