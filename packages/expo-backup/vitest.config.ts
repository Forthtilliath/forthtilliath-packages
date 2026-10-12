import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Native modules are replaced by in-memory fakes (vitest.setup.ts), and
    // Drive by a fake `fetch` — plain Node is enough.
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "**/*.test.ts",
        "src/index.ts",
        "src/types.ts",
        "src/__mocks__/**",
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 85,
        statements: 95,
      },
    },
  },
});
