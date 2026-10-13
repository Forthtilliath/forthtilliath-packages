---
"@forthtilliath/react-native-kit": minor
"@forthtilliath/expo-release-updates": minor
---

Native peer dependencies are now **optional**, so installing a package no longer pulls native modules (and their Android permissions, e.g. `CAMERA` via `expo-image-picker`) into apps that don't use them.

- `react-native-kit`: every peer dependency except `react` / `react-native` is optional. **Breaking:** `@forthtilliath/expo-release-updates-ui` moved from `dependencies` to an optional peer dependency — install it yourself if you use `UpdateSettingsScreen`. Apps importing the root barrel need all optional peers installed (prefer deep imports).
- `expo-release-updates`: `expo-file-system` and `expo-intent-launcher` are optional — install them if you use `downloadAndInstallApk`.
