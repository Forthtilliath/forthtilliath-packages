import pluginEslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

import { createBaseConfig } from "./base.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @param {import("./base.js").BaseConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export function createReactConfig(options) {
  return defineConfig([
    ...createBaseConfig(options),
    pluginReact.configs.flat["jsx-runtime"],
    pluginEslintReact.configs["recommended-type-checked"],
    {
      languageOptions: {
        ...pluginReact.configs.flat.recommended.languageOptions,
        globals: {
          ...globals.serviceworker,
          ...globals.browser,
        },
      },
    },
    {
      plugins: {
        "react-hooks": pluginReactHooks,
      },
      settings: { react: { version: "19" } },
      rules: {
        ...pluginReactHooks.configs.recommended.rules,
        // React scope no longer necessary with new JSX transform.
        "react/react-in-jsx-scope": "off",
      },
    },
    {
      // in main config for TSX/JSX source files
      plugins: {
        "react-refresh": pluginReactRefresh,
      },
      rules: {
        "react-refresh/only-export-components": "error",
      },
    },
    {
      // Scoped to TS files only (like base.js's own type-aware rules block):
      // these need type information, which plain .js files (next.config.js,
      // tailwind.config.js...) don't have once base's disableTypeChecked
      // block runs — without this restriction, this block re-enables them
      // and crashes ESLint on those files.
      files: ["**/*.{ts,tsx,mts,cts}"],
      rules: {
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "variable",
            format: ["camelCase"],
            leadingUnderscore: "allow",
          },
          {
            selector: "variable",
            modifiers: ["const"],
            format: ["camelCase", "UPPER_CASE", "PascalCase"],
            leadingUnderscore: "allow",
          },
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
          },
        ],
      },
    },
  ]);
}

/**
 * A custom ESLint configuration for libraries that use React, with the
 * default options. Use `createReactConfig(options)` instead to customize it.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactConfig = createReactConfig();
