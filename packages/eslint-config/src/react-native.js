import { defineConfig } from "eslint/config";
import pluginReactNative from "eslint-plugin-react-native";

import { createReactConfig } from "./react.js";

/**
 * eslint-plugin-react-native only ships a legacy (eslintrc) `configs.all`
 * export, no flat-config preset — so the plugin and its rules are wired by
 * hand here instead of spreading a ready-made flat config like storybook.js
 * does.
 */

/**
 * A custom ESLint configuration for React Native / Expo apps.
 *
 * @param {import("./base.js").BaseConfigOptions & import("./react.js").ReactConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]} */
export function createReactNativeConfig({ a11y = false, ...options } = {}) {
  return defineConfig([
    ...createReactConfig({ a11y, ...options }),
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
        "react-native/split-platform-components": "error",
        "react-native/no-raw-text": "error",
        // Off by default: both are stylistic preferences rather than
        // correctness checks, and inline styles in particular are a common,
        // legitimate RN pattern (one-off layout tweaks) that Prettier already
        // keeps readable.
        "react-native/no-inline-styles": "off",
        // Off: crashes outright under ESLint 10 ("context.getSourceCode is
        // not a function") — eslint-plugin-react-native@5.0.0 still calls the
        // API ESLint 10 removed, in the util shared by no-unused-styles/
        // no-color-literals and in sort-styles/no-single-element-style-arrays
        // directly. Re-enable once the plugin ships a fix.
        "react-native/no-unused-styles": "off",
        "react-native/no-single-element-style-arrays": "off",
        "react-native/sort-styles": "off",
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
export const reactNativeConfig = createReactNativeConfig();
