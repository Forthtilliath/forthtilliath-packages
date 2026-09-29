import type { Decorator } from "@storybook/react-vite";

import {
  type UiLocale,
  UiLocaleProvider,
} from "@forthtilliath/forth-ui/locale";

export const uiLocales: UiLocale[] = ["en", "fr"];

/** Renders every story in the toolbar's language (forth-ui built-in labels). */
export const withUiLocale: Decorator = (Story, context) => (
  <UiLocaleProvider locale={context.globals.locale as UiLocale}>
    <Story />
  </UiLocaleProvider>
);
