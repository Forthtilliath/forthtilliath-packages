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
