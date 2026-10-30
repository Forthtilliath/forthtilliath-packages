import { defineConfig } from "eslint/config";
import pluginReactNative from "eslint-plugin-react-native";

import { lazyConfig } from "./internal/lazy-config.js";
import { requireOptional } from "./internal/optional-plugin.js";
import { createReactConfig } from "./react.js";

/**
 * eslint-plugin-react-native only ships a legacy (eslintrc) `configs.all`
 * export, no flat-config preset — so the plugin and its rules are wired by
 * hand here instead of spreading a ready-made flat config like storybook.js
 * does.
 */

/**
 * @typedef {object} ReactNativeConfigOptions
 * @property {boolean} [expo=false] - Enable the eslint-plugin-expo rules that
 *   eslint-config-expo turns on (`use-dom-exports`,
 *   `no-env-var-destructuring`, `no-dynamic-env-var`), so an Expo app
 *   migrating from eslint-config-expo keeps them (needs `eslint-plugin-expo`
 *   installed).
 */

/**
 * A custom ESLint configuration for React Native / Expo apps.
 *
 * @param {import("./base.js").BaseConfigOptions & import("./react.js").ReactConfigOptions & ReactNativeConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]} */
export function createReactNativeConfig({
  a11y = false,
  expo = false,
  ...options
} = {}) {
  return defineConfig([
    ...createReactConfig({ a11y, ...options }),
    expo
      ? {
          plugins: {
            expo: /** @type {typeof import("eslint-plugin-expo")} */ (
              requireOptional("eslint-plugin-expo", "expo")
            ),
          },
          rules: {
            // Every `EXPO_PUBLIC_*` variable is inlined at build time by
            // reading `process.env.EXPO_PUBLIC_X` literally: a destructured or
            // computed access stays `undefined` in the bundle.
            "expo/no-env-var-destructuring": "error",
            "expo/no-dynamic-env-var": "error",
            "expo/use-dom-exports": "error",
          },
        }
      : [],
    {
      languageOptions: {
        globals: {
          // Injected by Metro/React Native at build time, dead-code-eliminated
          // in release builds — not part of globals.node or globals.browser.
          __DEV__: "readonly",
        },
      },
    },
    {
      plugins: {
        "react-native": pluginReactNative,
      },
      rules: {
        // The only rule of the plugin that doesn't crash under ESLint 10 (see
        // below) — real, useful signal (raw text outside a <Text>).
        "react-native/no-raw-text": "error",
        // Off by default: stylistic preference rather than a correctness
        // check, and a common, legitimate RN pattern (one-off layout tweaks)
        // that Prettier already keeps readable.
        "react-native/no-inline-styles": "off",
        // Off: every other rule crashes outright under ESLint 10
        // ("context.getSourceCode/getFilename is not a function") —
        // eslint-plugin-react-native@5.0.0 still calls APIs ESLint 10
        // removed, either directly (sort-styles,
        // no-single-element-style-arrays, split-platform-components) or via
        // the util shared with no-unused-styles/no-color-literals. Re-enable
        // each once the plugin ships a fix.
        "react-native/no-unused-styles": "off",
        "react-native/no-single-element-style-arrays": "off",
        "react-native/sort-styles": "off",
        "react-native/split-platform-components": "off",
        "react-native/no-color-literals": "off",
      },
    },
  ]);
}

/**
 * A custom ESLint configuration for React Native / Expo apps, with the
 * default options. Use `createReactNativeConfig(options)` instead to
 * customize it.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactNativeConfig = lazyConfig(() => createReactNativeConfig());
