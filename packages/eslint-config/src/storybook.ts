import type { Linter } from "eslint";
import storybook from "eslint-plugin-storybook";

export default [
	...storybook.configs["flat/recommended"],
	{
		ignores: ["!.storybook"],
	},
] satisfies Linter.Config[];
