import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginNode from "eslint-plugin-n";
import globals from "globals";
import tseslint, { type ConfigArray } from "typescript-eslint";

import importXConfig from "./importX.js";
import { nodeRules } from "./node.js";
import { sortConfig } from "./sort.js";
import turboConfig from "./turbo.js";

const jsPlugins = {
  node: pluginNode,
};

export const eslintConfig: ConfigArray = tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...turboConfig,
  ...importXConfig,
  {
    ignores: [
      "**/.svelte-kit/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/snap/**",
      "**/vite.config.*.timestamp-*.*",
    ],
  },
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: jsPlugins,
    rules: {
      ...nodeRules,
    },
  },
  sortConfig,
  eslintConfigPrettier,
]);

export default eslintConfig;
