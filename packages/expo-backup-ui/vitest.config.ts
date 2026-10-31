import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // react-native's real package entry uses Flow syntax that
      // @babel/parser's flow plugin can't parse, so Vitest can never load it
      // directly. Tests get a minimal stub instead — see
      // src/__mocks__/react-native.tsx for why this is safe here.
      "react-native": fileURLToPath(
        new URL("./src/__mocks__/react-native.tsx", import.meta.url),
      ),
    },
  },
  test: {
    // test-renderer produces a plain JSON tree, no real DOM needed.
    environment: "node",
    // @testing-library/react-native registers its cleanup and matchers on
    // the global afterEach / expect.
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      // On in CI (GitHub Actions sets CI=true), so `test` also enforces the
      // thresholds there instead of CI running every test twice.
      enabled: process.env.CI === "true",
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.{ts,tsx}", "**/__mocks__/**", "src/index.ts"],
      // Pinned near the actual coverage (the English labels' functions are
      // only partly called) — catches a real regression.
      thresholds: {
        lines: 93,
        functions: 88,
        branches: 92,
        statements: 92,
      },
    },
  },
});
