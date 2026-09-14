# @forthtilliath/expo-release-updates-ui

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
