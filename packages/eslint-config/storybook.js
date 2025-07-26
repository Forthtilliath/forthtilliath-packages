import { reactConfig } from "./react.js";
import storybook from "eslint-plugin-storybook";

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config[]} */
export const storybookConfig = [
  ...reactConfig,
  ...storybook.configs["flat/recommended"],
  {
    ignores: ["!.storybook"],
  },
  {
    // 👇 This should match the `stories` property in .storybook/main.js|ts
    files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
    rules: {
      // 👇 Enable this rule
      "storybook/csf-component": "error",
      // 👇 Disable this rule
      "storybook/default-exports": "off",
    },
  },
];
