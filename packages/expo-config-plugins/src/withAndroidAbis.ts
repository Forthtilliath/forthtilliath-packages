import { type ConfigPlugin, withGradleProperties } from "expo/config-plugins";

import { type AndroidAbisOptions, applyAndroidAbis } from "./transforms.js";

/**
 * Ships native code for real phones only (32- and 64-bit ARM) by default:
 * x86 / x86_64 only serve emulators and nearly double the APK's size.
 * `expo run:android` still passes the device's own ABI in development.
 *
 * `"@forthtilliath/expo-config-plugins/withAndroidAbis"`, or
 * `["@forthtilliath/expo-config-plugins/withAndroidAbis", { "abis": ["arm64-v8a"] }]`
 */
const withAndroidAbis: ConfigPlugin<AndroidAbisOptions | undefined> = (
  config,
  options,
) =>
  withGradleProperties(config, (mod) => {
    applyAndroidAbis(mod.modResults, options?.abis);
    return mod;
  });

export = withAndroidAbis;
