import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic + mocked expo-file-system/expo-intent-launcher — no need
    // for a browser-like or React Native environment.
    environment: "node",
  },
});
