# @forthtilliath/test-kit

## 0.2.0

### Minor Changes

- c431054: New package `@forthtilliath/test-kit`: framework-agnostic test helpers extracted from patterns duplicated across this monorepo's test files — `createMockResponse` (a `fetch()` `Response`-shaped mock builder), `loadJsonFixture` (reads a JSON fixture relative to the calling module via `import.meta.url`), and `createInMemoryFileSystem` (a generic in-memory file fake, the framework-agnostic sibling of `@forthtilliath/expo-test-kit`'s `createFakeExpoFileSystem`). `expo-release-updates`'s tests now use `createMockResponse` instead of hand-rolling the mock response object.
