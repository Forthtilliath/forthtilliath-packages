import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/postcss";
import { dirname, join } from "node:path";

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
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  docs: {
    defaultName: "Documentation",
  },
  viteFinal: (config) => {
    // Configuration Tailwind v4 directement dans Vite
    config.css = {
      ...config.css,
      postcss: {
        plugins: [tailwindcss()],
      },
    };

    return config;
  },
};
export default config;
