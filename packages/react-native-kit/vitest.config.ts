import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // react-native's real package entry uses Flow syntax that
      // @babel/parser's flow plugin can't parse (`as Cast` casts aren't
      // supported even with the flow plugin explicitly enabled), so Vitest
      // can never load it directly. Tests get a minimal stub instead — see
      // src/__mocks__/react-native.tsx for why this is safe here.
      "react-native": fileURLToPath(
        new URL("./src/__mocks__/react-native.tsx", import.meta.url),
      ),
      // @expo/vector-icons's build uses extensionless internal imports that
      // Vite/Rollup's strict ESM resolver can't follow — see
      // src/__mocks__/expo-vector-icons.tsx for why this is safe here.
      "@expo/vector-icons": fileURLToPath(
        new URL("./src/__mocks__/expo-vector-icons.tsx", import.meta.url),
      ),
      // Also ships Flow syntax in its package entry — see
      // src/__mocks__/react-native-gesture-handler.tsx for why this is safe.
      "react-native-gesture-handler": fileURLToPath(
        new URL(
          "./src/__mocks__/react-native-gesture-handler.tsx",
          import.meta.url,
        ),
      ),
      // Wraps a native module, unavailable under Vitest — see
      // src/__mocks__/expo-speech-recognition.tsx.
      "expo-speech-recognition": fileURLToPath(
        new URL("./src/__mocks__/expo-speech-recognition.tsx", import.meta.url),
      ),
      // Same reason — see src/__mocks__/expo-image-picker.ts.
      "expo-image-picker": fileURLToPath(
        new URL("./src/__mocks__/expo-image-picker.ts", import.meta.url),
      ),
    },
  },
  test: {
    // react-test-renderer produces a plain JSON tree, no real DOM needed.
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["**/*.test.{ts,tsx}", "**/__mocks__/**", "src/index.ts"],
      // Thresholds pinned near this package's actual coverage rather than a
      // round number — catches a real regression without blocking every PR
      // that doesn't happen to add a test for its one new line.
      thresholds: {
        lines: 88,
        functions: 85,
        branches: 83,
        statements: 87,
      },
    },
  },
});
