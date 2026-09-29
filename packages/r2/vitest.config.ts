import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // `fetch`, `Request`, `Response` and `File` are all Node globals — no DOM needed.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice. Locally,
      // `test` stays fast and `coverage` opts in.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.ts", "**/index.ts"],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
});
