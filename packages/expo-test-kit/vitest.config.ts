import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Real libsql I/O (temp sqlite files) + plain objects — no browser or
    // React Native environment needed.
    environment: "node",
  },
});
