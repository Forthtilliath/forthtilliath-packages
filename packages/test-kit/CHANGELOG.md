# @forthtilliath/test-kit

## 0.3.0

### Minor Changes

- a257370: - `test-kit`: `createMockResponse` returns a real `Response` (full API, assignable to `Response`) instead of a partial look-alike. **Behavior changes**: `ok` follows the real rule (a 3xx is no longer `ok` unless forced with `{ ok: true }`), and `json()` on a string body now parses it (it used to return the raw string). The `MockResponse` type is deprecated (alias of `Response`).
  - `expo-release-updates-ui`: `UpdateCheckRelease` is now an alias of `expo-release-updates`' `LatestRelease` instead of a duplicate, and `useUpdateCheck`'s `compareVersions` is optional (defaults to `expo-release-updates`' semver comparison).
  - `expo-test-kit`: tests now check that foreign keys are also enforced inside transactions (they are: libsql enables them by default on every connection).

## 0.2.0

### Minor Changes

- c431054: New package `@forthtilliath/test-kit`: framework-agnostic test helpers extracted from patterns duplicated across this monorepo's test files — `createMockResponse` (a `fetch()` `Response`-shaped mock builder), `loadJsonFixture` (reads a JSON fixture relative to the calling module via `import.meta.url`), and `createInMemoryFileSystem` (a generic in-memory file fake, the framework-agnostic sibling of `@forthtilliath/expo-test-kit`'s `createFakeExpoFileSystem`). `expo-release-updates`'s tests now use `createMockResponse` instead of hand-rolling the mock response object.
