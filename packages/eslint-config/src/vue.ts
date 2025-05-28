import type { Linter } from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueparser from "vue-eslint-parser";

export default [
	{
		name: "vue",
		files: ["**/*.vue"],
		languageOptions: {
			parser: vueparser,
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2020,
				parser: tseslint.parser,
				project: true,
				extraFileExtensions: [".vue"],
			},
			globals: {
				...globals.browser,
			},
		},
	},
] satisfies Linter.Config[];
