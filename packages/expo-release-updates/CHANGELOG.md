# @forthtilliath/expo-release-updates

## 0.5.0

### Minor Changes

- f3c3000: `fetchLatestRelease` / `fetchReleaseHistory`: requests now give up after `timeoutMs` (default 15 s) instead of hanging on a bad network, and accept a `signal` to cancel them. `fetchReleaseHistory` leaves draft releases out and clamps `limit` to GitHub's 1–100 range. The README now warns that a `token` bundled in an app can be extracted from the APK, and clarifies that `expectedMd5` catches a corrupted download, not a malicious release.

### Patch Changes

- ccdad7c: `isUpdateAvailable` / `compareVersions` handle pre-release versions (via `ts-kit`): an install on `1.2.0-beta.1` is now offered the stable `1.2.0`.
- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.
- Updated dependencies [c1bd669]
- Updated dependencies [ccdad7c]
- Updated dependencies [d26f492]
- Updated dependencies [cae6bd0]
  - @forthtilliath/ts-kit@0.11.0

## 0.4.7

### Patch Changes

- Updated dependencies [a2b9dee]
  - @forthtilliath/ts-kit@0.10.0

## 0.4.6

### Patch Changes

- Updated dependencies [d8e0863]
  - @forthtilliath/ts-kit@0.9.0

## 0.4.5

### Patch Changes

- Updated dependencies [09787a7]
  - @forthtilliath/ts-kit@0.8.0

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
