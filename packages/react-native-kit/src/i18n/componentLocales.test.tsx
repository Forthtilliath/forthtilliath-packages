import type { ReactElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import { ExpoSpeechRecognitionModule } from "../__mocks__/expo-speech-recognition.js";
import { screenTexts } from "../__mocks__/screenQueries.js";
import { PhotoPicker } from "../components/picker/PhotoPicker.js";
import { PickerModal } from "../components/picker/PickerModal.js";
import { AboutSettingsScreen } from "../components/settings/AboutSettingsScreen.js";
import { BackupSettingsScreen } from "../components/settings/BackupSettingsScreen.js";
import { ContactSettingsScreen } from "../components/settings/ContactSettingsScreen.js";
import { PrivacySettingsScreen } from "../components/settings/PrivacySettingsScreen.js";
import { ThemeSettingsScreen } from "../components/settings/ThemeSettingsScreen.js";
import { UpdateSettingsScreen } from "../components/settings/UpdateSettingsScreen.js";
import { ThemeOptionList } from "../components/theme/ThemeOptionList.js";
import { ThemeToggle } from "../components/theme/ThemeToggle.js";

import { KitLocaleProvider } from "./KitLocaleProvider.js";

/** Every string the element renders in a <Text>. */
async function texts(element: ReactElement) {
  await render(element);
  return screenTexts();
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
  [
    "PhotoPicker",
    (locale) => (
      <PhotoPicker
        photoUri={null}
        onChange={vi.fn()}
        savePhoto={vi.fn()}
        photoLabel="du récipient"
        locale={locale}
      />
    ),
    "Ajouter une photo",
    "Add a photo",
  ],
  [
    "PickerModal",
    (locale) => (
      <PickerModal
        visible
        title="Pick"
        items={[]}
        onSelect={vi.fn()}
        onClose={vi.fn()}
        locale={locale}
      />
    ),
    "Aucun résultat.",
    "No results.",
  ],
  [
    "UpdateSettingsScreen",
    (locale) => (
      <UpdateSettingsScreen
        currentVersion="1.0.0"
        // Never settles: keeps the screen in its initial state.
        checkForUpdate={() => new Promise(() => undefined)}
        compareVersions={() => 0}
        downloadAndInstallApk={vi.fn()}
        locale={locale}
      />
    ),
    "Version installée",
    "Installed version",
  ],
  [
    "BackupSettingsScreen",
    (locale) => (
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        reminder={{ enabled: false, onToggle: vi.fn(), intervalDays: 7 }}
        locale={locale}
      />
    ),
    "Une notification tous les 7 jours pour penser à exporter.",
    "A notification every 7 days as a reminder to export.",
  ],
];

it("PickerModal hands its locale down to voice search", async () => {
  ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({
    granted: true,
  });
  await render(
    <PickerModal
      visible
      title="Pick"
      items={[]}
      onSelect={vi.fn()}
      onClose={vi.fn()}
      locale="en"
    />,
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Dictate the search" }),
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  expect(ExpoSpeechRecognitionModule.start).toHaveBeenLastCalledWith(
    expect.objectContaining({ lang: "en-US" }),
  );
});

describe.each(cases)("%s built-in labels", (_name, build, fr, en) => {
  it("are French by default", async () => {
    expect(await texts(build())).toContain(fr);
  });

  it("are English with locale='en'", async () => {
    const rendered = await texts(build("en"));
    expect(rendered).toContain(en);
    expect(rendered).not.toContain(fr);
  });

  it("follow the nearest KitLocaleProvider", async () => {
    expect(
      await texts(<KitLocaleProvider locale="en">{build()}</KitLocaleProvider>),
    ).toContain(en);
  });
});
