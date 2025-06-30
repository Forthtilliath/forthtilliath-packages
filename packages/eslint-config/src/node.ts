// https://github.com/eslint-community/eslint-plugin-n
import type { Linter } from "eslint";
import nodePlugin from "eslint-plugin-n";

export const nodeRules = {
  /** Enforce usage of the `node:` prefix for builtin imports */
  "node/prefer-node-protocol": "error",
} satisfies Linter.RulesRecord;

export default [
  nodePlugin.configs["flat/recommended-script"],
  {
    rules: {
      "n/exports-style": ["error", "module.exports"],
    },
  },
] satisfies Linter.Config[];
