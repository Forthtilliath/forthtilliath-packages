# @forthtilliath/react-native-kit

## 0.7.0

### Minor Changes

- 93d7c64: Add a root barrel export (`import { X, Y } from "@forthtilliath/react-native-kit"`) alongside the existing deep-import paths, for callers importing several exports at once who don't mind the peer-dependency-bundling trade-off (see README). Deep imports remain the recommended default.

## 0.6.0

### Minor Changes

- 896df0c: Add `useEffectiveColorScheme`, `ThemeToggle`, `useUpdateCheck`, and `UpdateAvailableBanner` — light/dark/system theme preference handling, and a generic "check for an update once per launch, notify via a dismissible banner" flow with no opinion on where persistence lives.

## 0.5.0

### Minor Changes

- 1c99f06: Fix `PickerModal`'s `styles.iconColor` being shared between the "add" extra-action icon and the row thumbnail placeholder icon, even when both a distinct primary color and a muted color are wanted for each. Split into `extraActionIconColor` and `rowThumbnailPlaceholderIconColor`. Breaking rename, but `iconColor` had no consumer yet.

## 0.4.0

### Minor Changes

- 9e1538b: Add `Thumbnail`, `SwipeableRow`, `VoiceSearchButton`, `PhotoPicker`, and `PickerModal` — the same themeable-via-`styles`-prop pattern as `ChangelogNotes`, with no dependency on any app's internal theme hook.

## 0.3.0

### Minor Changes

- 5e7e55e: Add `useSubmitGuard`, `useDebouncedChange`, `confirmDestructive`, and framework-agnostic `utils/` (getPeriodStartMs, getMostRecentIds, nextInCycle, normalizeForSearch, rankByNameMatch, escapeCsvField, formatCsvNumber, escapeHtml).

## 0.2.0

### Minor Changes

- de7aab6: First public release. `ChangelogNotes` renders GitHub-style release notes (parsed by `@forthtilliath/expo-release-updates`) as headings, bulleted items, and bold-aware text, with themeable styles.

### Patch Changes

- Updated dependencies [2d71bda]
  - @forthtilliath/expo-release-updates@0.2.0
