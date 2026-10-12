import pluginEslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

import { lazyConfig } from "./internal/lazy-config.js";
import { importOptional, requirePlugin } from "./internal/optional-plugin.js";
import { createBaseConfig, createNamingConventionRule } from "./base.js";

// Optional peer dependencies, each behind an option (see
// ReactConfigOptions): a project leaving the option off doesn't install them.
const [pluginJsxA11y, pluginI18next, pluginTestingLibrary, pluginJestDom] =
  await Promise.all([
    importOptional(
      "eslint-plugin-jsx-a11y",
      () => import("eslint-plugin-jsx-a11y"),
    ),
    importOptional(
      "eslint-plugin-i18next",
      () => import("eslint-plugin-i18next"),
    ),
    importOptional(
      "eslint-plugin-testing-library",
      () => import("eslint-plugin-testing-library"),
    ),
    importOptional(
      "eslint-plugin-jest-dom",
      () => import("eslint-plugin-jest-dom"),
    ),
  ]);

/**
 * Any file matching this is a test file, whatever runner or naming
 * convention is used to suffix it (`.test.`, `.spec.`, `.dom.test.`...) —
 * `*` matches across dots, so `*.test.tsx` already covers `foo.dom.test.tsx`.
 * @type {string[]}
 */
const TEST_FILE_GLOBS = ["**/*.{test,spec}.{ts,tsx,js,jsx}"];

/**
 * eslint-plugin-react-hooks rules that @eslint-react also implements, under
 * the same name. Only the @eslint-react version is kept (see the rules block
 * below); `src/nextjs.test.js` fails if a new overlap appears.
 * @type {string[]}
 */
const RULES_COVERED_BY_ESLINT_REACT = [
  "rules-of-hooks",
  "exhaustive-deps",
  "static-components",
  "use-memo",
  "set-state-in-effect",
  "error-boundaries",
  "purity",
  "set-state-in-render",
  "unsupported-syntax",
];

/**
 * @typedef {object} ReactConfigOptions
 * @property {boolean} [a11y=true] - Enable eslint-plugin-jsx-a11y's
 *   recommended rules (needs `eslint-plugin-jsx-a11y` installed).
 * @property {boolean} [i18n=false] - Enable eslint-plugin-i18next's
 *   `no-literal-string` rule, forbidding any hardcoded string in JSX (needs
 *   `eslint-plugin-i18next` installed). Only makes sense for a project fully
 *   committed to i18n (e.g. driven by next-intl) — off by default since it
 *   flags every literal otherwise.
 * @property {boolean} [testingLibrary=false] - Enable
 *   eslint-plugin-testing-library's React rules and eslint-plugin-jest-dom's
 *   recommended rules, scoped to test files only (needs both installed). Off
 *   by default:
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
  snakeCase = false,
  ...options
} = {}) {
  return defineConfig([
    ...createBaseConfig({ snakeCase, ...options }),
    a11y
      ? requirePlugin(pluginJsxA11y, "eslint-plugin-jsx-a11y", "a11y")
          .flatConfigs.recommended
      : [],
    i18n
      ? {
          plugins: {
            i18next: requirePlugin(
              pluginI18next,
              "eslint-plugin-i18next",
              "i18n",
            ),
          },
          rules: { "i18next/no-literal-string": "error" },
        }
      : [],
    testingLibrary
      ? [
          {
            ...requirePlugin(
              pluginTestingLibrary,
              "eslint-plugin-testing-library",
              "testingLibrary",
            ).configs["flat/react"],
            files: TEST_FILE_GLOBS,
          },
          {
            ...requirePlugin(
              pluginJestDom,
              "eslint-plugin-jest-dom",
              "testingLibrary",
            ).configs["flat/recommended"],
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
        // Already covered by @eslint-react's recommended-type-checked preset
        // (sometimes more thoroughly: its `purity` flags `new Date()`, the
        // react-hooks one doesn't). Left on, every problem is reported twice
        // and every disable comment has to name both plugins.
        ...Object.fromEntries(
          RULES_COVERED_BY_ESLINT_REACT.map((rule) => [
            `react-hooks/${rule}`,
            "off",
          ]),
        ),
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
        "@typescript-eslint/naming-convention": createNamingConventionRule({
          snakeCase,
          react: true,
        }),
      },
    },
  ]);
}

/**
 * A custom ESLint configuration for libraries that use React, with the
 * default options. Use `createReactConfig(options)` instead to customize it.
 *
 * @type {import("eslint").Linter.Config[]} */
export const reactConfig = lazyConfig(() => createReactConfig());
