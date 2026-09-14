import { defineConfig } from "eslint/config";

import { baseConfig } from "./src/base.js";

export default defineConfig([
  ...baseConfig,
  // Fixtures deliberately break the rules they exist to test (e.g. a bad
  // Angular selector) and need compiler options (decorators) this package's
  // own tsconfig has no reason to enable — excluded from this package's own
  // self-lint, exercised instead by src/angular.test.js via ESLint's Node API.
  { ignores: ["src/__fixtures__/**"] },
]);
