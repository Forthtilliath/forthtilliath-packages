# @forthtilliath/expo-test-kit

## 0.3.1

### Patch Changes

- a257370: - `test-kit`: `createMockResponse` returns a real `Response` (full API, assignable to `Response`) instead of a partial look-alike. **Behavior changes**: `ok` follows the real rule (a 3xx is no longer `ok` unless forced with `{ ok: true }`), and `json()` on a string body now parses it (it used to return the raw string). The `MockResponse` type is deprecated (alias of `Response`).
  - `expo-release-updates-ui`: `UpdateCheckRelease` is now an alias of `expo-release-updates`' `LatestRelease` instead of a duplicate, and `useUpdateCheck`'s `compareVersions` is optional (defaults to `expo-release-updates`' semver comparison).
  - `expo-test-kit`: tests now check that foreign keys are also enforced inside transactions (they are: libsql enables them by default on every connection).

## 0.3.0

### Minor Changes

- 56d8944: **Breaking:** `src/` is now organized by config instead of flat files, so deep imports moved: `createTestDb`, `closeTestDb`, `resetTestDb` and `mockDbClient` are now under `@forthtilliath/expo-test-kit/sqlite/*`, and `createFakeExpoFileSystem` is now under `@forthtilliath/expo-test-kit/file-system/createFakeExpoFileSystem`. Prepares room for a future DB config (e.g. Postgres) alongside `sqlite/` without remixing files. No behavior change.

## 0.2.0

### Minor Changes

- 657d63e: First public release. `createTestDb`/`closeTestDb`/`resetTestDb` for a real in-memory SQLite database (via libsql) with Drizzle migrations replayed, `mockDbClient` to swap it in for a repository's real client, and `createFakeExpoFileSystem`/`getFakeExpoFileSystem` for a minimal `expo-file-system` fake.
