import { defineConfig } from "eslint/config";
import storybook from "eslint-plugin-storybook";

import { reactConfig } from "./react.js";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const storybookConfig = defineConfig([
  ...reactConfig,
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
