import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node-only package (child processes, Postgres, file system); the database
    // and the Supabase CLI are faked, the consumers' own suites run for real.
    environment: "node",
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      // `src/cli/*.ts` entry files only wire `process` to the tested `run*`
      // functions.
      exclude: ["**/*.test.ts", "**/index.ts", "src/cli/*.ts", "src/testIo.ts"],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 90,
        statements: 95,
      },
    },
  },
});
