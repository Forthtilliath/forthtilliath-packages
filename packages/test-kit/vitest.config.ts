import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure logic + node:fs/node:url — no DOM needed.
    environment: "node",
  },
});
