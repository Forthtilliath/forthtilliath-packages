import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Most of this package is pure logic and runs fine under Node.
    // Files that touch the DOM (e.g. src/files/downloadText.test.ts)
    // opt into jsdom via a `// @vitest-environment jsdom` docblock.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice. Locally,
      // `test` stays fast and `coverage` opts in.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.ts", "**/index.ts"],
      // Thresholds pinned near this package's actual coverage rather than a
      // round number — catches a real regression without blocking every PR
      // that doesn't happen to add a test for its one new line.
      thresholds: {
        lines: 97,
        functions: 98,
        branches: 88,
        statements: 97,
      },
    },
  },
});
