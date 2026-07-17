import type { Decorator } from "@storybook/react-vite";

// Raw CSS text (not parsed modules): each file defines the same
// `:root`/`.dark` variable names, so only one can be active at a time.
const themeModules = import.meta.glob<string>(
  "../../../packages/react/shadcn-ui/src/styles/themes/*.css",
  { eager: true, query: "?raw", import: "default" },
);

export const colorThemeCss: Record<string, string> = Object.fromEntries(
  Object.entries(themeModules).map(([path, css]) => {
    const name =
      path
        .split("/")
        .pop()
        ?.replace(/\.css$/, "") ?? path;
    return [name, css];
  }),
);

export const colorThemeNames = Object.keys(colorThemeCss).sort();

const STYLE_ELEMENT_ID = "storybook-color-theme-override";

function applyColorTheme(name: string) {
  const css = colorThemeCss[name] ?? "";
  let styleElement = document.getElementById(STYLE_ELEMENT_ID);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = STYLE_ELEMENT_ID;
    document.head.append(styleElement);
  }
  styleElement.textContent = css;
}

// Compiled `globals.css` defines the default theme's `:root`/`.dark`
// variables inside `@layer theme`. An un-layered <style> tag always wins the
// CSS cascade over any layered style regardless of DOM order, so injecting
// the selected theme's raw CSS here reliably overrides it without needing to
// rebuild globals.css per theme.
export const withColorTheme: Decorator = (Story, context) => {
  const colorTheme =
    (context.globals as { colorTheme?: string }).colorTheme ??
    colorThemeNames[0] ??
    "default";
  applyColorTheme(colorTheme);
  return Story();
};
