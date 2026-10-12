import { type ConfigPlugin, withAppBuildGradle } from "expo/config-plugins";

import {
  applyReleaseSigning,
  type ReleaseSigningOptions,
} from "./transforms.js";

/**
 * Signs the release APK with the app's own upload key instead of React
 * Native's public `debug.keystore` (the same key in every RN project: anyone
 * could sign a fake update). The key and its passwords stay out of the repo,
 * read as Gradle properties (`~/.gradle/gradle.properties` or
 * `ORG_GRADLE_PROJECT_*` variables). Without them the release build fails
 * ("Keystore file not set") instead of falling back to the debug key.
 *
 * `["@forthtilliath/expo-config-plugins/withReleaseSigning", { "propertyPrefix": "MYAPP" }]`
 */
const withReleaseSigning: ConfigPlugin<ReleaseSigningOptions | undefined> = (
  config,
  options,
) =>
  withAppBuildGradle(config, (mod) => {
    mod.modResults.contents = applyReleaseSigning(
      mod.modResults.contents,
      options?.propertyPrefix,
    );
    return mod;
  });

export = withReleaseSigning;
