import type { Preview } from "@storybook/react-vite";

import { colorThemeNames, withColorTheme } from "./color-themes";
import { twDecoratorHtml } from "./decorators";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // To not have conflicts with decorators which setup the theme
    backgrounds: { disable: true },
  },
  tags: ["autodocs"],
  decorators: [twDecoratorHtml, withColorTheme],
  globalTypes: {
    colorTheme: {
      description: "Color theme",
      toolbar: {
        title: "Color theme",
        icon: "paintbrush",
        items: colorThemeNames,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorTheme: "default",
  },
};

export default preview;
