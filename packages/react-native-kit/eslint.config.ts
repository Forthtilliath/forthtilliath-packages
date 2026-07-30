import { defineConfig } from "eslint/config";

import { reactConfig } from "@forthtilliath/eslint-config/react";

export default defineConfig([
  ...reactConfig,
  // Not part of the package's tsconfig (rootDir: "src"), so keep them out of
  // type-aware linting rather than fighting the project service over it.
  { ignores: ["vitest.config.ts", "vitest.setup.ts", "eslint.config.ts"] },
]);
