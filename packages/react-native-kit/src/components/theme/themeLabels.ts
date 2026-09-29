import type { KitLocale } from "../../i18n/locale.js";

import type { ThemeToggleLabels } from "./ThemeToggle.js";

/** Default light/dark/system labels, shared by ThemeToggle and ThemeOptionList. */
export const defaultThemeLabels = {
  fr: { light: "Clair", dark: "Sombre", system: "Système" },
  en: { light: "Light", dark: "Dark", system: "System" },
} satisfies Record<KitLocale, Required<ThemeToggleLabels>>;
