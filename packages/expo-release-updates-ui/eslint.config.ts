import { defineConfig } from "eslint/config";

import { createReactConfig } from "@forthtilliath/eslint-config/react";

export default defineConfig([
  // a11y: false — eslint-plugin-jsx-a11y targets DOM/web semantics (anchors,
  // labels, mouse events...); it doesn't understand React Native's own
  // accessibility model and just pattern-matches JSX prop names, producing
  // false positives.
  ...createReactConfig({ a11y: false }),
  // Not part of the package's tsconfig (rootDir: "src"), so keep them out of
  // type-aware linting rather than fighting the project service over it.
  { ignores: ["vitest.config.ts", "vitest.setup.ts", "eslint.config.ts"] },
]);
