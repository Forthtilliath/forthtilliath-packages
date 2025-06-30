import baseConfig from "./src/index.js";
import vueConfig from "./src/vue.js";

export default [
  ...baseConfig,
  ...vueConfig,
] as import("eslint").Linter.Config[];
