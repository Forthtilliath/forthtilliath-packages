import { withThemeByClassName } from "@storybook/addon-themes";
import type { ReactRenderer } from "@storybook/react-vite";

export const twDecoratorHtml = withThemeByClassName<ReactRenderer>({
  themes: {
    light: "",
    dark: "dark",
  },
  defaultTheme: "light",
  parentSelector: "html",
});
