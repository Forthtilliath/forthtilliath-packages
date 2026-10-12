import { type ConfigPlugin, withAppBuildGradle } from "expo/config-plugins";

import { applyShortCxxPath, type ShortCxxPathOptions } from "./transforms.js";

/**
 * Moves the CMake staging directory (`.cxx`) out of the project: on Windows,
 * release builds overflow the 260-character path limit on
 * react-native-gesture-handler's codegen paths. A no-op on other systems
 * unless `stagingDir` is set.
 *
 * `"@forthtilliath/expo-config-plugins/withShortCxxPath"`
 */
const withShortCxxPath: ConfigPlugin<ShortCxxPathOptions | undefined> = (
  config,
  options,
) => {
  const stagingDir =
    options?.stagingDir ?? (process.platform === "win32" ? "C:/rncxx" : null);
  if (!stagingDir) return config;
  return withAppBuildGradle(config, (mod) => {
    mod.modResults.contents = applyShortCxxPath(
      mod.modResults.contents,
      stagingDir,
    );
    return mod;
  });
};

export = withShortCxxPath;
