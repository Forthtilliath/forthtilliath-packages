import type { Preview } from "@storybook/react-vite";

import { colorThemeNames, withColorTheme } from "./color-themes";
import { twDecoratorHtml } from "./decorators";
import { uiLocales, withUiLocale } from "./locale";
import { nameComponentProps } from "./source";

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
    docs: {
      source: {
        // "Show code" prints the rendered JSX — the default shows a story
        // with a custom `render` as its raw CSF object ("{ render: () => … }").
        type: "dynamic",
        transform: (code: string) => nameComponentProps(code),
      },
    },
    // axe runs on every story (Accessibility panel, and in the Vitest run).
    // "error": any violation fails the story. The few rules a story opts
    // out of (parameters.a11y.config) are violations inside the shadcn-ui
    // copies, or WCAG exemptions (disabled controls), each with its reason.
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
  decorators: [twDecoratorHtml, withColorTheme, withUiLocale],
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
    locale: {
      description: "Language of the forth-ui built-in labels",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: uiLocales,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorTheme: "default",
    locale: "en",
  },
};

export default preview;
