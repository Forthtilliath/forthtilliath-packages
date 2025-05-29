import type { Linter } from "eslint";
import storybook from "eslint-plugin-storybook";

export default [
	...storybook.configs["flat/recommended"],
	{
		ignores: ["!.storybook"],
	},
  {
    // 👇 This should match the `stories` property in .storybook/main.js|ts
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      // 👇 Enable this rule
      'storybook/csf-component': 'error',
      // 👇 Disable this rule
      'storybook/default-exports': 'off',
    },
  },
] satisfies Linter.Config[];
