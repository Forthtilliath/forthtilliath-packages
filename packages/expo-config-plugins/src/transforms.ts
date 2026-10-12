// The plugins' actual work, as pure functions over the generated files'
// contents — testable without running `expo prebuild` — and their options.

/** The `signingConfig signingConfigs.debug` of the `release` build type (not the `debug` one's). */
const RELEASE_USES_DEBUG_KEY =
  /(buildTypes\s*\{[\s\S]*?release\s*\{[^}]*?)signingConfig signingConfigs\.debug/;

function releaseSigningConfig(prefix: string): string {
  const property = (name: string) => `findProperty('${prefix}_UPLOAD_${name}')`;
  return `signingConfigs {
        release {
            if (${property("STORE_FILE")}) {
                storeFile file(${property("STORE_FILE")})
                storePassword ${property("STORE_PASSWORD")}
                keyAlias ${property("KEY_ALIAS")}
                keyPassword ${property("KEY_PASSWORD")}
            }
        }`;
}

/**
 * Makes `android/app/build.gradle` sign release builds with the app's own
 * upload key, read from `<PREFIX>_UPLOAD_*` Gradle properties, instead of
 * React Native's **public** `debug.keystore`. The debug build is untouched;
 * already-patched contents are returned as is.
 *
 * @throws When `prefix` isn't an upper-case identifier, or when the expected
 *   signing block isn't there — failing the prebuild beats shipping an APK
 *   signed with the debug key.
 */
export function applyReleaseSigning(
  contents: string,
  prefix: string | undefined,
): string {
  if (prefix === undefined || !/^[A-Z][A-Z0-9_]*$/.test(prefix)) {
    throw new Error(
      "withReleaseSigning: missing or invalid propertyPrefix option (e.g. MYAPP)",
    );
  }
  if (contents.includes("signingConfig signingConfigs.release"))
    return contents;
  if (
    !RELEASE_USES_DEBUG_KEY.test(contents) ||
    !contents.includes("signingConfigs {")
  ) {
    throw new Error(
      "withReleaseSigning: signing block not found in android/app/build.gradle",
    );
  }
  return contents
    .replace(RELEASE_USES_DEBUG_KEY, "$1signingConfig signingConfigs.release")
    .replace("signingConfigs {", releaseSigningConfig(prefix));
}

/** One entry of `gradle.properties`, as Expo's `withGradleProperties` exposes it. */
export type GradlePropertiesItem =
  | { type: "property"; key: string; value: string }
  | { type: "comment"; value: string }
  | { type: "empty" };

/** Real phones only: 32- and 64-bit ARM. */
export const ARM_ABIS: readonly string[] = ["armeabi-v7a", "arm64-v8a"];

/**
 * Sets `reactNativeArchitectures` in `gradle.properties` (in place), so the
 * APK only ships native code for `abis` — x86 / x86_64 only serve emulators
 * and nearly double the APK's size. `expo run:android` still passes the
 * device's own ABI, which wins over this value in development.
 */
export function applyAndroidAbis(
  properties: GradlePropertiesItem[],
  abis: readonly string[] = ARM_ABIS,
): GradlePropertiesItem[] {
  const value = abis.join(",");
  const existing = properties.find(
    (item): item is Extract<GradlePropertiesItem, { type: "property" }> =>
      item.type === "property" && item.key === "reactNativeArchitectures",
  );
  if (existing) existing.value = value;
  else
    properties.push({
      type: "property",
      key: "reactNativeArchitectures",
      value,
    });
  return properties;
}

/**
 * Moves the CMake staging directory (`.cxx`) out of `android/app` to
 * `stagingDir`: nested in the project, release builds overflow Windows'
 * 260-character path limit on react-native-gesture-handler's codegen paths.
 * Already-patched contents are returned as is.
 *
 * @throws When the `namespace` line to anchor on isn't found.
 */
export function applyShortCxxPath(
  contents: string,
  stagingDir: string,
): string {
  if (contents.includes("buildStagingDirectory")) return contents;
  if (!contents.includes("    namespace")) {
    throw new Error(
      "withShortCxxPath: `namespace` line not found in android/app/build.gradle",
    );
  }
  return contents.replace(
    "    namespace",
    `    externalNativeBuild {
        cmake {
            buildStagingDirectory "${stagingDir.replace(/\\/g, "/")}"
        }
    }

    namespace`,
  );
}

export interface ReleaseSigningOptions {
  /**
   * Prefix of the Gradle properties holding the upload key, e.g. `MYAPP` for
   * `MYAPP_UPLOAD_STORE_FILE`, `MYAPP_UPLOAD_STORE_PASSWORD`,
   * `MYAPP_UPLOAD_KEY_ALIAS`, `MYAPP_UPLOAD_KEY_PASSWORD`.
   */
  propertyPrefix?: string;
}

export interface AndroidAbisOptions {
  /** @defaultValue `["armeabi-v7a", "arm64-v8a"]` — real phones only */
  abis?: string[];
}

export interface ShortCxxPathOptions {
  /**
   * Where CMake stages native builds. Given, it always applies; omitted, the
   * plugin only acts on Windows, with `C:/rncxx`.
   */
  stagingDir?: string;
}
