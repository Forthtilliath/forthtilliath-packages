import tsParser from "@typescript-eslint/parser";
import { importX, type PluginFlatConfig } from "eslint-plugin-import-x";

export default [
  // importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  importX.flatConfigs.react,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "import-x/no-dynamic-require": "warn",
      // "import-x/no-nodejs-modules": "warn",
    },
  },
] satisfies PluginFlatConfig[];
