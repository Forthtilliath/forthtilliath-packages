import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginNode from "eslint-plugin-n";
import globals from "globals";
import tseslint from "typescript-eslint";
import { importRules } from "./import.js";
import { nodeRules } from "./node.js";
import turboConfig from "./turbo.js";
import importXConfig from "./importX.js";

const jsPlugins = {
  node: pluginNode,
};

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
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
      ...importRules,
      ...nodeRules,
    },
  },
  eslintConfigPrettier,
]);
