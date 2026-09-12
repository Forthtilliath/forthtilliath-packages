import { defineConfig } from "eslint/config";
import storybook from "eslint-plugin-storybook";

import { createReactConfig } from "./react.js";

/**
 * A custom ESLint configuration for libraries that use React and Storybook.
 *
 * @param {import("./base.js").BaseConfigOptions & import("./react.js").ReactConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]} */
export function createStorybookConfig(options) {
  return defineConfig([
    ...createReactConfig(options),
    ...storybook.configs["flat/recommended"],
    {
      ignores: ["!.storybook"],
    },
    {
      // Should match the `stories` property in .storybook/main.js|ts.
      files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
      rules: {
        "storybook/csf-component": "error",
        "storybook/default-exports": "off",
      },
    },
  ]);
}

/**
 * A custom ESLint configuration for libraries that use React and Storybook,
 * with the default options. Use `createStorybookConfig(options)` instead to
 * customize it.
 *
 * @type {import("eslint").Linter.Config[]} */
export const storybookConfig = createStorybookConfig();
