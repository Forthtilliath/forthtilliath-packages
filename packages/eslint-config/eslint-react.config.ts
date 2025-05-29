import tseslint from "typescript-eslint";
import baseConfig from "./src/index.js";
import reactConfig from "./src/react.js";

export const eslintConfig: tseslint.ConfigArray = tseslint.config([
	...baseConfig,
	...reactConfig,
]);
export default eslintConfig;
