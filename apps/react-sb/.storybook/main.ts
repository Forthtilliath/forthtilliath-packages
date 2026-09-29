import type { StorybookConfig } from "@storybook/react-vite";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Storybook 10 loads this file as ESM, where `require` doesn't exist.
const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    defaultName: "Documentation",
  },
  // "Show code" prints components by their function name: keep names through
  // minification, or a static build shows `<c />` instead of `<IconBubble />`.
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    esbuild: {
      ...(viteConfig.esbuild === false ? {} : viteConfig.esbuild),
      keepNames: true,
    },
  }),
};
export default config;
