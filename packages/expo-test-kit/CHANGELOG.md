# @forthtilliath/expo-test-kit

## 0.2.0

### Minor Changes

- 657d63e: First public release. `createTestDb`/`closeTestDb`/`resetTestDb` for a real in-memory SQLite database (via libsql) with Drizzle migrations replayed, `mockDbClient` to swap it in for a repository's real client, and `createFakeExpoFileSystem`/`getFakeExpoFileSystem` for a minimal `expo-file-system` fake.
