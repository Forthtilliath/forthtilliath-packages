import tseslint from "typescript-eslint";

import config from "./src/index.js";

export const eslintConfig: tseslint.ConfigArray = tseslint.config([...config]);
export default eslintConfig;
