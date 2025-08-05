import { withThemeByClassName } from "@storybook/addon-themes";
import { ReactRenderer } from "@storybook/react-vite";

export const decoratorHtml = withThemeByClassName<ReactRenderer>({
  themes: {
    light: "",
    dark: "dark",
  },
  defaultTheme: "light",
  parentSelector: "html",
});

export const decoratorStory = withThemeByClassName<ReactRenderer>({
  themes: {
    light: "bg-background",
    dark: "bg-background",
  },
  defaultTheme: "light",
  parentSelector: ".docs-story",
});
