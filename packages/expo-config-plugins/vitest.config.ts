import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The plugins' logic lives in pure string/array transforms — no Expo
    // runtime needed to test them.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      // The with* wrappers only hand the transforms to Expo's mod helpers.
      include: ["src/transforms.ts"],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
});
