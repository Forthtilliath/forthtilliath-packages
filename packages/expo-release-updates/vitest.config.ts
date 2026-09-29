import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic + mocked expo-file-system/expo-intent-launcher — no need
    // for a browser-like or React Native environment.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice. Locally,
      // `test` stays fast and `coverage` opts in.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.ts", "src/index.ts"],
      // Thresholds pinned near this package's actual coverage rather than a
      // round number — catches a real regression without blocking every PR
      // that doesn't happen to add a test for its one new line.
      thresholds: {
        lines: 99,
        functions: 99,
        branches: 70,
        statements: 99,
      },
    },
  },
});
