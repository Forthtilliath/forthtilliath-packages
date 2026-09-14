import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // ESLint's type-aware linting builds a real TypeScript program per
    // fixture file (see src/angular.test.js) — slower than the default 5s
    // budget on a cold run.
    testTimeout: 20_000,
  },
});
