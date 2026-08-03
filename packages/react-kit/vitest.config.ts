import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Some hooks/components in this package touch the DOM (event listeners,
    // rendering, etc.), so everything runs under jsdom.
    environment: "jsdom",
  },
});
