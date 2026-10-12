import { defineConfig } from "eslint/config";

import { baseConfig } from "@forthtilliath/eslint-config/base";

export default defineConfig([
  ...baseConfig,
  // Not part of the package's tsconfig (rootDir: "src"), so keep them out of
  // type-aware linting rather than fighting the project service over it.
  { ignores: ["vitest.config.ts", "eslint.config.ts"] },
]);
