import { defineConfig } from "eslint/config";

import { createReactConfig } from "@forthtilliath/eslint-config/react";

export default defineConfig([
  // a11y: false — same reason as react-native-kit: jsx-a11y only knows DOM
  // semantics, not React Native's accessibility props.
  ...createReactConfig({ a11y: false }),
  { ignores: ["eslint.config.ts", "scripts/**", "dist/**"] },
]);
