import type { Linter } from "eslint";

import { nextJsConfig } from "@forthtilliath/eslint-config/nextjs";

const config: Linter.Config[] = [
  // Plain Node build scripts, outside the app's tsconfig (same as react-sb).
  { ignores: ["scripts/**"] },
  ...nextJsConfig,
];

export default config;
