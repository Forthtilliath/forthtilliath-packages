# @forthtilliath/expo-config-plugins

## 0.4.0

### Minor Changes

- 07044c8: `withShortCxxPath` takes a `cmakeVersion` option (e.g. `"4.1.2"`) that pins a recent CMake for `:app`: on Windows with Gesture Handler 3 / Reanimated 4.7, the default CMake 3.22 still overflows the path limit even in `C:/rncxx`.

### Patch Changes

- 960b127: Complete JSDoc on every public export: props, options, style slots and labels now describe what they do and their defaults, shown on hover in editors. Implementation-only exports are marked `@internal`. READMEs list the previously undocumented exports.

## 0.3.0

### Minor Changes

- c6079e0: `withReleaseRemovedPermissions` strips permissions from the release APK only — `INTERNET` by default, so an offline app can't send anything off the phone whatever a dependency tries — through a generated `src/release/AndroidManifest.xml`. Debug builds keep them; a release manifest it didn't generate is never overwritten, and only permission names are accepted.

## 0.2.0

### Minor Changes

- 0789b65: ts-kit: new `pickRandom(array, random?)`, one element picked at random (`undefined` for an empty array). expo-config-plugins: new `withKotlinJvmTarget` plugin, forcing every Kotlin compile task to the Java code's JVM target (`jvmTarget`, 17 by default) so a module like expo-dynamic-app-icon no longer fails the build with "Inconsistent JVM-target compatibility".

## 0.1.0

### Minor Changes

- 169a201: New package of Expo config plugins for sideloaded Android apps: `withReleaseSigning` (release APK signed with your own upload key from Gradle properties, never React Native's public debug key — the build fails without it), `withAndroidAbis` (ARM-only native code by default) and `withShortCxxPath` (short CMake staging path on Windows). Their pure transforms are exported from `/transforms`.
