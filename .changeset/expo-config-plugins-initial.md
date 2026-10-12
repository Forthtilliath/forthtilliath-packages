---
"@forthtilliath/expo-config-plugins": minor
---

New package of Expo config plugins for sideloaded Android apps: `withReleaseSigning` (release APK signed with your own upload key from Gradle properties, never React Native's public debug key — the build fails without it), `withAndroidAbis` (ARM-only native code by default) and `withShortCxxPath` (short CMake staging path on Windows). Their pure transforms are exported from `/transforms`.
