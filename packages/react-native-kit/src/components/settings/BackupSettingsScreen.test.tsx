/* eslint-disable @typescript-eslint/no-deprecated -- see ChangelogNotes.test.tsx */
import { Alert, Pressable, Switch, Text } from "react-native";
import { act, create } from "react-test-renderer";
import { Ionicons } from "@expo/vector-icons";
import { describe, expect, it, vi } from "vitest";

import type { AlertButton } from "../../__mocks__/react-native.js";
import { propsOf } from "../../__mocks__/testInstance.js";

import { BackupSettingsScreen } from "./BackupSettingsScreen.js";

function renderTree(element: Parameters<typeof create>[0]) {
  let tree!: ReturnType<typeof create>;
  act(() => {
    tree = create(element);
  });
  return tree;
}

async function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("BackupSettingsScreen", () => {
  it("calls onExport when the export button is pressed", async () => {
    const onExport = vi.fn().mockResolvedValue(undefined);
    const tree = renderTree(
      <BackupSettingsScreen onExport={onExport} onImport={vi.fn()} />,
    );
    const [exportButton] = tree.root.findAllByType(Pressable);
    if (!exportButton) throw new Error("expected an export button");

    await act(async () => {
      propsOf<{ onPress: () => void }>(exportButton).onPress();
      await flushAsync();
    });

    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("asks for confirmation before calling onImport, and only imports on confirm", async () => {
    const onImport = vi.fn().mockResolvedValue(undefined);
    const alertSpy = vi
      .spyOn(Alert, "alert")
      .mockImplementation((_title, _message, buttons?: AlertButton[]) => {
        buttons?.find((b) => b.style === "destructive")?.onPress?.();
      });
    const tree = renderTree(
      <BackupSettingsScreen onExport={vi.fn()} onImport={onImport} />,
    );
    const [, importButton] = tree.root.findAllByType(Pressable);
    if (!importButton) throw new Error("expected an import button");

    await act(async () => {
      propsOf<{ onPress: () => void }>(importButton).onPress();
      await flushAsync();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      "Importer une sauvegarde ?",
      expect.any(String),
      expect.anything(),
    );
    expect(onImport).toHaveBeenCalledTimes(1);
    alertSpy.mockRestore();
  });

  it("doesn't show a reminder row when `reminder` is omitted", () => {
    const tree = renderTree(
      <BackupSettingsScreen onExport={vi.fn()} onImport={vi.fn()} />,
    );
    expect(tree.root.findAllByType(Switch)).toHaveLength(0);
  });

  it("shows a reminder switch and calls onToggle when pressed", () => {
    const onToggle = vi.fn();
    const tree = renderTree(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        reminder={{ enabled: false, onToggle, intervalDays: 7 }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain(
      "Une notification tous les 7 jours pour penser à exporter.",
    );

    act(() => {
      propsOf<{ onValueChange: (v: boolean) => void }>(
        tree.root.findByType(Switch),
      ).onValueChange(true);
    });

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("shows an info box with its label and value when `info` is given", () => {
    const tree = renderTree(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        info={{
          label: "Dernière sauvegarde auto",
          value: "Aujourd'hui à 08:00",
        }}
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Dernière sauvegarde auto");
    expect(texts).toContain("Aujourd'hui à 08:00");
  });

  it("renders a titled section per action when layout is 'sections'", () => {
    const tree = renderTree(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        layout="sections"
      />,
    );
    const texts = tree.root
      .findAllByType(Text)
      .map((t) => propsOf<{ children: unknown }>(t).children);
    expect(texts).toContain("Exporter");
    expect(texts).toContain("Importer");
    expect(tree.root.findAllByType(Pressable)).toHaveLength(2);
  });

  it("shows a leading icon on a button when `icons` sets one for it", () => {
    const tree = renderTree(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        icons={{ export: "cloud-upload-outline" }}
      />,
    );
    const icons = tree.root
      .findAllByType(Ionicons)
      .map((el) => propsOf<{ name: unknown }>(el).name);
    expect(icons).toEqual(["cloud-upload-outline"]);
  });
});
