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
    // axe runs on every story (Accessibility panel, and in the Vitest run).
    // "todo": violations are reported, not failing — 60 of the 440 tests
    // still have some (mostly color-contrast and unlabeled fields), part of
    // them in the shadcn copies. Switch to "error" once they are fixed.
    a11y: { test: "todo" },
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
