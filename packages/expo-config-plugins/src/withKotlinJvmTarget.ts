import { type ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

import {
  applyKotlinJvmTarget,
  type KotlinJvmTargetOptions,
} from "./transforms.js";

/**
 * Makes every Kotlin compile task target the same JVM as the Java code (17
 * by default): some native modules (e.g. expo-dynamic-app-icon) compile
 * their Kotlin for another target, and the build fails with "Inconsistent
 * JVM-target compatibility".
 *
 * `"@forthtilliath/expo-config-plugins/withKotlinJvmTarget"`, or
 * `["@forthtilliath/expo-config-plugins/withKotlinJvmTarget", { "jvmTarget": "21" }]`
 */
const withKotlinJvmTarget: ConfigPlugin<KotlinJvmTargetOptions | undefined> = (
  config,
  options,
) =>
  withProjectBuildGradle(config, (mod) => {
    mod.modResults.contents = applyKotlinJvmTarget(
      mod.modResults.contents,
      options?.jvmTarget,
    );
    return mod;
  });

export = withKotlinJvmTarget;
