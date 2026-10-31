# @forthtilliath/expo-config-plugins

Expo config plugins for sideloaded Android apps (APKs shared directly, not through a store).

## Install

```bash
npm install --save-dev @forthtilliath/expo-config-plugins
```

`expo` is a peer dependency. Then list the plugins in `app.json`, and run `npx expo prebuild` again.

```json
{
  "expo": {
    "plugins": [
      [
        "@forthtilliath/expo-config-plugins/withReleaseSigning",
        { "propertyPrefix": "MYAPP" }
      ],
      "@forthtilliath/expo-config-plugins/withAndroidAbis",
      "@forthtilliath/expo-config-plugins/withShortCxxPath",
      "@forthtilliath/expo-config-plugins/withKotlinJvmTarget"
    ]
  }
}
```

## `withReleaseSigning` — sign releases with your own key

Out of the box, an Expo release APK is signed with React Native's `debug.keystore` — **the same public key in every React Native project**: anyone could sign an APK that Android accepts as an update of yours. This plugin makes the release build use your upload key instead, read from Gradle properties that stay out of the repository:

```properties
# ~/.gradle/gradle.properties (or ORG_GRADLE_PROJECT_MYAPP_UPLOAD_* variables)
MYAPP_UPLOAD_STORE_FILE=C:/keys/myapp-upload.jks
MYAPP_UPLOAD_STORE_PASSWORD=…
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_KEY_PASSWORD=…
```

Without these properties the release build **fails** ("Keystore file not set") rather than falling back to the debug key. If Expo's Gradle template changes and the signing block can't be found, the prebuild fails too. The debug build is untouched.

| Option           | Type     | Notes                                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------------------- |
| `propertyPrefix` | `string` | Required, upper case (`MYAPP` → `MYAPP_UPLOAD_*`). One prefix per app and per key. |

## `withAndroidAbis` — real phones only

Ships native code for 32- and 64-bit ARM only: x86 / x86_64 only serve emulators and nearly double the APK's size. `expo run:android` still builds for the connected device's ABI.

| Option | Type       | Default                        |
| ------ | ---------- | ------------------------------ |
| `abis` | `string[]` | `["armeabi-v7a", "arm64-v8a"]` |

## `withShortCxxPath` — Windows path length

On Windows, release builds can overflow the 260-character path limit inside `android/app/.cxx` (react-native-gesture-handler's codegen paths). This plugin moves CMake's staging directory to a short path. It does nothing on other systems unless `stagingDir` is set.

| Option       | Type     | Default                           |
| ------------ | -------- | --------------------------------- |
| `stagingDir` | `string` | `C:/rncxx` on Windows, else unset |

## `withKotlinJvmTarget` — one JVM target for Kotlin

Some native modules (e.g. `expo-dynamic-app-icon`) compile their Kotlin code for another JVM target than the project's Java code, and the build fails with "Inconsistent JVM-target compatibility". This plugin appends a block to `android/build.gradle` forcing every Kotlin compile task, in every subproject, to the same target.

| Option      | Type     | Default |
| ----------- | -------- | ------- |
| `jvmTarget` | `string` | `"17"`  |

## `withReleaseRemovedPermissions` — a release APK that can't go online

For an app that works fully offline (personal, health or intimate data), removing the `INTERNET` permission from the **release** APK makes Android itself guarantee that nothing can leave the phone — whatever a dependency (an SDK, a library's telemetry) tries. Debug builds keep the permission: Metro needs the network.

```json
"@forthtilliath/expo-config-plugins/withReleaseRemovedPermissions"
```

The plugin writes `android/app/src/release/AndroidManifest.xml`, merged by Gradle over the main manifest and every library's, with `tools:node="remove"` on each permission: it's dropped whoever declared it. It refuses to overwrite a release manifest it didn't generate, and fails the prebuild on anything but permission names (they end up in XML). Check the result with `aapt dump permissions app-release.apk`.

| Option        | Type       | Default        | Notes                                                                                     |
| ------------- | ---------- | -------------- | ----------------------------------------------------------------------------------------- |
| `permissions` | `string[]` | `["INTERNET"]` | Short (`ACCESS_NETWORK_STATE`) or full (`com.google.android.gms.permission.AD_ID`) names. |

Remove it the day a feature really needs the network (update check, Drive backup…): without `INTERNET`, every request fails.

## Testing your own setup

The transforms behind the plugins are exported as pure functions from `@forthtilliath/expo-config-plugins/transforms` (`applyReleaseSigning`, `applyAndroidAbis`, `applyShortCxxPath`, `applyKotlinJvmTarget`, `buildReleaseRemovedPermissionsManifest`).

## Scripts

| Script        | What it does                   |
| ------------- | ------------------------------ |
| `build`       | Compiles `src/` to CommonJS.   |
| `test`        | Runs the transform tests.      |
| `lint`        | ESLint, zero warnings allowed. |
| `check-types` | Type-checks without emitting.  |
