/* eslint-disable @typescript-eslint/no-deprecated -- see PickerModal.test.tsx */
import type { ReactElement } from "react";
import { Text } from "react-native";
import { act, create } from "react-test-renderer";
import { describe, expect, it, vi } from "vitest";

import { propsOf } from "../__mocks__/testInstance.js";
import { AboutSettingsScreen } from "../components/settings/AboutSettingsScreen.js";
import { ContactSettingsScreen } from "../components/settings/ContactSettingsScreen.js";
import { PrivacySettingsScreen } from "../components/settings/PrivacySettingsScreen.js";
import { ThemeSettingsScreen } from "../components/settings/ThemeSettingsScreen.js";
import { ThemeOptionList } from "../components/theme/ThemeOptionList.js";
import { ThemeToggle } from "../components/theme/ThemeToggle.js";

import { KitLocaleProvider } from "./KitLocaleProvider.js";

// Every string rendered in a <Text>, to check a component's built-in labels.
function texts(element: ReactElement): unknown[] {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree.root
    .findAllByType(Text)
    .map((t) => propsOf<{ children: unknown }>(t).children);
}

// One row per component: how to render it, one French and one English label.
const cases: [
  string,
  (locale?: "fr" | "en") => ReactElement,
  string,
  string,
][] = [
  [
    "ThemeToggle",
    (locale) => (
      <ThemeToggle value="system" onChange={vi.fn()} locale={locale} />
    ),
    "Sombre",
    "Dark",
  ],
  [
    "ThemeOptionList",
    (locale) => (
      <ThemeOptionList value="system" onChange={vi.fn()} locale={locale} />
    ),
    "Sombre",
    "Dark",
  ],
  [
    "ThemeSettingsScreen",
    (locale) => (
      <ThemeSettingsScreen value="system" onChange={vi.fn()} locale={locale} />
    ),
    "Système",
    "System",
  ],
  [
    "AboutSettingsScreen",
    (locale) => (
      <AboutSettingsScreen
        appName="App"
        version="1.0.0"
        description="x"
        developerName="Ada"
        locale={locale}
      />
    ),
    "Développée par Ada.",
    "Developed by Ada.",
  ],
  [
    "ContactSettingsScreen",
    (locale) => <ContactSettingsScreen email="a@b.c" locale={locale} />,
    "Une question, un bug, une suggestion ?",
    "A question, a bug, a suggestion?",
  ],
  [
    "PrivacySettingsScreen",
    (locale) => <PrivacySettingsScreen locale={locale} />,
    "Stockage local uniquement",
    "Local storage only",
  ],
];

describe.each(cases)("%s built-in labels", (_name, render, fr, en) => {
  it("are French by default", () => {
    expect(texts(render())).toContain(fr);
  });

  it("are English with locale='en'", () => {
    const rendered = texts(render("en"));
    expect(rendered).toContain(en);
    expect(rendered).not.toContain(fr);
  });

  it("follow the nearest KitLocaleProvider", () => {
    expect(
      texts(<KitLocaleProvider locale="en">{render()}</KitLocaleProvider>),
    ).toContain(en);
  });
});
