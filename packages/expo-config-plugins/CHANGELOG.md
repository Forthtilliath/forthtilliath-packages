# @forthtilliath/expo-config-plugins

## 0.2.0

### Minor Changes

- 0789b65: ts-kit: new `pickRandom(array, random?)`, one element picked at random (`undefined` for an empty array). expo-config-plugins: new `withKotlinJvmTarget` plugin, forcing every Kotlin compile task to the Java code's JVM target (`jvmTarget`, 17 by default) so a module like expo-dynamic-app-icon no longer fails the build with "Inconsistent JVM-target compatibility".

## 0.1.0

### Minor Changes

- 169a201: New package of Expo config plugins for sideloaded Android apps: `withReleaseSigning` (release APK signed with your own upload key from Gradle properties, never React Native's public debug key — the build fails without it), `withAndroidAbis` (ARM-only native code by default) and `withShortCxxPath` (short CMake staging path on Windows). Their pure transforms are exported from `/transforms`.
