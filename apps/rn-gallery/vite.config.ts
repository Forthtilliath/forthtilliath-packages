import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// The kit's components rendered in a browser by react-native-web, for the
// screenshots of its README (scripts/capture.mjs). Not an app to ship.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: "react-native-web" },
      // The real package loads its fonts through expo-font: a small shim
      // draws the same glyphs from the same font file instead.
      {
        find: /^@expo\/vector-icons$/,
        replacement: fileURLToPath(
          new URL("./src/shims/vector-icons.tsx", import.meta.url).href,
        ),
      },
    ],
    extensions: [".web.tsx", ".web.ts", ".web.js", ".tsx", ".ts", ".js"],
  },
  define: {
    __DEV__: "false",
    // react-native-web's Animated reads React Native's global.
    global: "globalThis",
  },
  server: { port: 5199, strictPort: true },
});
