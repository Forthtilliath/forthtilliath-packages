import { defineConfig } from "eslint/config";

import { reactConfig } from "@forthtilliath/eslint-config/react";

export default defineConfig([
  ...reactConfig,
  // Not part of the package's tsconfig (like eslint.config.ts), so keep it
  // out of type-aware linting.
  { ignores: ["vitest.config.ts"] },
]);
