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

// Forces every custom-property declaration to win regardless of where/how
// Tailwind's compiled globals.css ends up declaring the same variables
// (layer, specificity and DOM order are otherwise too fragile to rely on).
function forceImportant(css: string): string {
  return css.replace(/(--[\w-]+\s*:\s*[^;{}]+?)\s*;/g, "$1 !important;");
}

function applyColorTheme(name: string) {
  const css = colorThemeCss[name] ?? "";
  let styleElement = document.getElementById(STYLE_ELEMENT_ID);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = STYLE_ELEMENT_ID;
    document.head.append(styleElement);
  }
  styleElement.textContent = forceImportant(css);
}
export const withColorTheme: Decorator = (Story, context) => {
  const colorTheme =
    (context.globals as { colorTheme?: string }).colorTheme ??
    colorThemeNames[0] ??
    "default";
  applyColorTheme(colorTheme);
  return Story();
};
