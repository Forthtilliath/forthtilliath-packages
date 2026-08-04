# @forthtilliath/react-native-kit

## 0.9.0

### Minor Changes

- c8bec64: Reorganized `src/` into `components/{picker,theme,update,list}/`, `hooks/`, and `utils/{format,helpers}/` subfolders. Deep-import paths change accordingly, e.g. `@forthtilliath/react-native-kit/PickerModal` becomes `@forthtilliath/react-native-kit/components/picker/PickerModal`, `@forthtilliath/react-native-kit/useSubmitGuard` becomes `@forthtilliath/react-native-kit/hooks/useSubmitGuard`, and `@forthtilliath/react-native-kit/utils/escapeCsvField` becomes `@forthtilliath/react-native-kit/utils/format/escapeCsvField`. The root barrel import (`import { X } from "@forthtilliath/react-native-kit"`) is unaffected. See the README for the full list of new paths.

## 0.8.0

### Minor Changes

- 5a91b24: Added `ThemeOptionList`, a row-based (icon + label + checkmark) alternative to `ThemeToggle` for a light/dark/system theme preference.

### Patch Changes

- Updated dependencies [b1957c9]
  - @forthtilliath/expo-release-updates@0.3.0

## 0.7.2

### Patch Changes

- 8fb505a: Fix every component's `styles` prop so a partial override (e.g. just `backgroundColor`) only changes the properties it specifies, instead of silently dropping the rest of the default style object (layout, border radius, alignment...). Affected: `ChangelogNotes`, `PhotoPicker`, `PickerModal`, `SwipeableRow`, `Thumbnail`, `ThemeToggle`, `UpdateAvailableBanner`.

## 0.7.1

### Patch Changes

- 436a08c: Document that the root barrel export should be avoided under Jest/CommonJS: `export *` re-exports are evaluated eagerly on `require()`, so requiring the barrel from any file pulls in every component's module graph — including native-module imports unavailable under Jest — even for files that only want an unrelated util.

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
