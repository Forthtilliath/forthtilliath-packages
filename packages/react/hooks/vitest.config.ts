import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // All hooks in this package are meant to run in a browser-like
    // environment (event listeners, DOM state, etc.).
    environment: "jsdom",
  },
});
