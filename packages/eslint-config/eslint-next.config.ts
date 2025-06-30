import tseslint, { type ConfigArray } from "typescript-eslint";

import baseConfig from "./src/index.js";
import reactConfig from "./src/react.js";

export const nextReactConfig: ConfigArray = tseslint.config([
  ...baseConfig,
  ...reactConfig,
]);

export default nextReactConfig;
