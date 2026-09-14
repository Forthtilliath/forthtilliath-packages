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
    },
  },
  test: {
    // react-test-renderer produces a plain JSON tree, no real DOM needed.
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
  },
});
