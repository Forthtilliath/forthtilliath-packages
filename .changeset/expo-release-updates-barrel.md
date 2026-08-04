---
"@forthtilliath/expo-release-updates": minor
---

Added a root barrel export (`import { ... } from "@forthtilliath/expo-release-updates"`) alongside the existing per-file deep imports, mirroring `@forthtilliath/react-native-kit`. README updated with the same "avoid the barrel under Jest/CommonJS" caveat as react-native-kit, since `downloadAndInstallApk`'s native-module imports (`expo-file-system`, `expo-intent-launcher`) would otherwise be eagerly required.
