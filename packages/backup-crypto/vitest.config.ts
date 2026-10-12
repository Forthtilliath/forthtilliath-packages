import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic on bytes and strings — Node's own `crypto.getRandomValues`
    // is all the environment needs.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.ts", "src/index.ts"],
      // Encryption code: anything below full coverage is a real gap.
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 95,
        statements: 100,
      },
    },
  },
});
