import { defineConfig } from "eslint/config";

import config from "@forthtilliath/eslint-config/";

export default defineConfig([
  ...config,
  // Not part of the package's tsconfig (like eslint.config.ts), so keep it
  // out of type-aware linting.
  { ignores: ["vitest.config.ts"] },
]);
