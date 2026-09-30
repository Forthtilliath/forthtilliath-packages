# @forthtilliath/expo-release-updates-ui

## 0.3.0

### Minor Changes

- 1ca67e8: `UpdateAvailableBanner` gets a `locale` prop (`"fr" | "en"`, French by default — unchanged behavior) for English built-in labels on bilingual apps; `labels` still overrides individual strings.

### Patch Changes

- c1bd669: Relative imports in the published ESM now carry their `.js` extension (`./slot-or-callback.js`, `../button/index.js`), so the packages load under plain Node ESM (Vitest with externalized deps, SSR scripts…) and not only through a bundler. These packages now type-check with `moduleResolution: NodeNext`, which enforces it — except `react-native-kit` and `expo-release-updates-ui` (only ever loaded through Metro, they keep `bundler` resolution) and `shadcn-ui`, whose sources are shadcn components kept as-is: its `dist/` gets the extensions added by a post-build step instead.
- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.
- a257370: - `test-kit`: `createMockResponse` returns a real `Response` (full API, assignable to `Response`) instead of a partial look-alike. **Behavior changes**: `ok` follows the real rule (a 3xx is no longer `ok` unless forced with `{ ok: true }`), and `json()` on a string body now parses it (it used to return the raw string). The `MockResponse` type is deprecated (alias of `Response`).
  - `expo-release-updates-ui`: `UpdateCheckRelease` is now an alias of `expo-release-updates`' `LatestRelease` instead of a duplicate, and `useUpdateCheck`'s `compareVersions` is optional (defaults to `expo-release-updates`' semver comparison).
  - `expo-test-kit`: tests now check that foreign keys are also enforced inside transactions (they are: libsql enables them by default on every connection).
- Updated dependencies [ccdad7c]
- Updated dependencies [f3c3000]
- Updated dependencies [c1bd669]
  - @forthtilliath/expo-release-updates@0.5.0

## 0.2.8

### Patch Changes

- @forthtilliath/expo-release-updates@0.4.7

## 0.2.7

### Patch Changes

- @forthtilliath/expo-release-updates@0.4.6

## 0.2.6

### Patch Changes

- @forthtilliath/expo-release-updates@0.4.5

## 0.2.5

### Patch Changes

- @forthtilliath/expo-release-updates@0.4.4

## 0.2.4

### Patch Changes

- @forthtilliath/expo-release-updates@0.4.3

## 0.2.3

### Patch Changes

- Updated dependencies [c431054]
  - @forthtilliath/expo-release-updates@0.4.2

## 0.2.2

### Patch Changes

- Updated dependencies [05f2fa3]
  - @forthtilliath/expo-release-updates@0.4.1

## 0.2.1

### Patch Changes

- Updated dependencies [dd98b0c]
  - @forthtilliath/expo-release-updates@0.4.0

## 0.2.0

### Minor Changes

- 2d9833d: **Breaking:** `ChangelogNotes`, `UpdateAvailableBanner` and `useUpdateCheck` moved out of `@forthtilliath/react-native-kit` into the new `@forthtilliath/expo-release-updates-ui` package — install it alongside `react-native-kit` if you use them. `UpdateSettingsScreen` now renders release notes via that package internally.

  The framework-agnostic helpers (`getPeriodStartMs`, `getMostRecentIds`, `nextInCycle`, `normalizeForSearch`, `rankByNameMatch`, `escapeCsvField`, `formatCsvNumber`, `escapeHtml`) moved to `@forthtilliath/ts-kit` and are re-exported from `react-native-kit`'s root barrel for compatibility — deep `utils/format/*` and `utils/helpers/*` import paths for them no longer exist; import from `@forthtilliath/ts-kit` instead.

  `PickerModal` and `UpdateSettingsScreen` were split into smaller files (styles/sub-components extracted) with no change to their public API.
