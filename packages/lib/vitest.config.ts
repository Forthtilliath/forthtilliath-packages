import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Most of this package is pure logic and runs fine under Node.
    // Files that touch the DOM (e.g. src/files/downloadText.test.ts)
    // opt into jsdom via a `// @vitest-environment jsdom` docblock.
    environment: "node",
  },
});
