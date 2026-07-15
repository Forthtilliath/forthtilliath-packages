import { defineConfig } from "eslint/config";

import { baseConfig } from "@forthtilliath/eslint-config";

export default defineConfig([
  ...baseConfig,
  // Not part of the package's tsconfig (like eslint.config.ts), so keep it
  // out of type-aware linting.
  { ignores: ["vitest.config.ts"] },
]);
