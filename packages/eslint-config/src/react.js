import pluginEslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import pluginI18next from "eslint-plugin-i18next";
import pluginJestDom from "eslint-plugin-jest-dom";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginTestingLibrary from "eslint-plugin-testing-library";
import globals from "globals";

import { createBaseConfig } from "./base.js";

/**
 * Any file matching this is a test file, whatever runner or naming
 * convention is used to suffix it (`.test.`, `.spec.`, `.dom.test.`...) —
 * `*` matches across dots, so `*.test.tsx` already covers `foo.dom.test.tsx`.
 * @type {string[]}
 */
const TEST_FILE_GLOBS = ["**/*.{test,spec}.{ts,tsx,js,jsx}"];

/**
 * @typedef {object} ReactConfigOptions
 * @property {boolean} [a11y=true] - Enable eslint-plugin-jsx-a11y's
 *   recommended rules.
 * @property {boolean} [i18n=false] - Enable eslint-plugin-i18next's
 *   `no-literal-string` rule, forbidding any hardcoded string in JSX. Only
 *   makes sense for a project fully committed to i18n (e.g. driven by
 *   next-intl) — off by default since it flags every literal otherwise.
 * @property {boolean} [testingLibrary=false] - Enable
 *   eslint-plugin-testing-library's React rules and eslint-plugin-jest-dom's
 *   recommended rules, scoped to test files only. Off by default:
 *   `testing-library/no-manual-cleanup` in particular assumes
 *   `@testing-library/*`'s automatic `afterEach(cleanup)` is active, which
 *   only happens when `afterEach` is a real global (vitest's `test.globals:
 *   true`, or Jest) — without that, a manual `cleanup()` call is genuinely
 *   required and this rule would be a false positive.
 */

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @param {import("./base.js").BaseConfigOptions & ReactConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export function createReactConfig({
  a11y = true,
  i18n = false,
  testingLibrary = false,
  ...options
} = {}) {
  return defineConfig([
    ...createBaseConfig(options),
    a11y ? pluginJsxA11y.flatConfigs.recommended : [],
    i18n
      ? {
          plugins: { i18next: pluginI18next },
          rules: { "i18next/no-literal-string": "error" },
        }
      : [],
    testingLibrary
      ? [
          {
            ...pluginTestingLibrary.configs["flat/react"],
            files: TEST_FILE_GLOBS,
          },
          {
            ...pluginJestDom.configs["flat/recommended"],
            files: TEST_FILE_GLOBS,
          },
        ]
      : [],
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
