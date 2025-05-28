import type { Linter } from "eslint";

import turboPlugin from "eslint-plugin-turbo";

export default [
	{
		plugins: {
			turbo: turboPlugin,
		},
		rules: {
			"turbo/no-undeclared-env-vars": "warn",
		},
	},
] satisfies Linter.Config[];
