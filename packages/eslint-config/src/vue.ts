import type { Linter } from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueparser from "vue-eslint-parser";

export const vueConfig: Linter.Config[] = [
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
];

export default vueConfig;
