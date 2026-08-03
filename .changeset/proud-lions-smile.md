---
"@forthtilliath/react-native-kit": patch
---

Fix every component's `styles` prop so a partial override (e.g. just `backgroundColor`) only changes the properties it specifies, instead of silently dropping the rest of the default style object (layout, border radius, alignment...). Affected: `ChangelogNotes`, `PhotoPicker`, `PickerModal`, `SwipeableRow`, `Thumbnail`, `ThemeToggle`, `UpdateAvailableBanner`.
