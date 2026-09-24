# @forthtilliath/expo-release-updates

## 0.4.4

### Patch Changes

- Updated dependencies [e2d621a]
  - @forthtilliath/ts-kit@0.7.0

## 0.4.3

### Patch Changes

- Updated dependencies [9d0e8c6]
  - @forthtilliath/ts-kit@0.6.0

## 0.4.2

### Patch Changes

- c431054: New package `@forthtilliath/test-kit`: framework-agnostic test helpers extracted from patterns duplicated across this monorepo's test files — `createMockResponse` (a `fetch()` `Response`-shaped mock builder), `loadJsonFixture` (reads a JSON fixture relative to the calling module via `import.meta.url`), and `createInMemoryFileSystem` (a generic in-memory file fake, the framework-agnostic sibling of `@forthtilliath/expo-test-kit`'s `createFakeExpoFileSystem`). `expo-release-updates`'s tests now use `createMockResponse` instead of hand-rolling the mock response object.
  - @forthtilliath/ts-kit@0.5.0

## 0.4.1

### Patch Changes

- 05f2fa3: Moved `compareVersions` (new `version/` category) and `parseChangelogNotes` (new `markdown/` category) from `@forthtilliath/expo-release-updates` into `@forthtilliath/ts-kit` — both were 100% framework-agnostic. `expo-release-updates` now re-exports them from `ts-kit`, so its public API (root barrel and `@forthtilliath/expo-release-updates/compareVersions` / `.../parseChangelogNotes` deep imports) is unchanged.
- Updated dependencies [05f2fa3]
  - @forthtilliath/ts-kit@0.5.0

## 0.4.0

### Minor Changes

- dd98b0c: Added `token` to `GithubRepoRef` (sent as a `Bearer` header on `fetchLatestRelease`/`fetchReleaseHistory`) for private repos and higher GitHub API rate limits, `expectedMd5` to `downloadAndInstallApk` to verify the downloaded APK's integrity before installing it, and `isUpdateAvailable(current, latest)` as a named wrapper around `compareVersions`.

## 0.3.0

### Minor Changes

- b1957c9: Added a root barrel export (`import { ... } from "@forthtilliath/expo-release-updates"`) alongside the existing per-file deep imports, mirroring `@forthtilliath/react-native-kit`. README updated with the same "avoid the barrel under Jest/CommonJS" caveat as react-native-kit, since `downloadAndInstallApk`'s native-module imports (`expo-file-system`, `expo-intent-launcher`) would otherwise be eagerly required.

## 0.2.0

### Minor Changes

- 2d71bda: First public release. Self-update a sideloaded Android Expo app from its GitHub Releases: `compareVersions`, `fetchLatestRelease`, `fetchReleaseHistory`, `downloadAndInstallApk`, and `parseChangelogNotes` for rendering release notes.
