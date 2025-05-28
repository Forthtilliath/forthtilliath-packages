import type { Linter } from "eslint";

import stylisticTs from "@stylistic/eslint-plugin-ts";
import parserTs from "@typescript-eslint/parser";

export default [
	{
		plugins: {
			"@stylistic/ts": stylisticTs,
		},
		languageOptions: {
			parser: parserTs,
		},
		rules: {
			"@typescript-eslint/indent": ["error", 2],
			"@stylistic/ts/indent": ["error", 2],
		},
	},
] satisfies Linter.Config[];
