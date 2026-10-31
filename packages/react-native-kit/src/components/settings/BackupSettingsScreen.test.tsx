import { Alert } from "react-native";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { describe, expect, it, vi } from "vitest";

import type { AlertButton } from "../../__mocks__/react-native.js";
import { screenElements, screenIcons } from "../../__mocks__/screenQueries.js";

import { BackupSettingsScreen } from "./BackupSettingsScreen.js";

const exportButton = () => screen.getByRole("button", { name: "⬆️ Exporter" });
const importButton = () => screen.getByRole("button", { name: "⬇️ Importer" });

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("BackupSettingsScreen", () => {
  it("calls onExport when the export button is pressed", async () => {
    const onExport = vi.fn().mockResolvedValue(undefined);
    await render(
      <BackupSettingsScreen onExport={onExport} onImport={vi.fn()} />,
    );

    await fireEvent.press(exportButton());
    await act(flushAsync);

    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("ignores a second export tap made before the re-render (double tap)", async () => {
    let finish!: () => void;
    const onExport = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    await render(
      <BackupSettingsScreen onExport={onExport} onImport={vi.fn()} />,
    );
    const { onPress } = exportButton().props as { onPress: () => void };

    await act(async () => {
      // Same render, same handler: both taps see "not exporting" in state.
      onPress();
      onPress();
      await flushAsync();
    });
    expect(onExport).toHaveBeenCalledTimes(1);

    await act(async () => {
      finish();
      await flushAsync();
    });
  });

  it("asks for confirmation before calling onImport, and only imports on confirm", async () => {
    const onImport = vi.fn().mockResolvedValue(undefined);
    const alertSpy = vi
      .spyOn(Alert, "alert")
      .mockImplementation((_title, _message, buttons?: AlertButton[]) => {
        buttons?.find((b) => b.style === "destructive")?.onPress?.();
      });
    await render(
      <BackupSettingsScreen onExport={vi.fn()} onImport={onImport} />,
    );

    await fireEvent.press(importButton());
    await act(flushAsync);

    expect(alertSpy).toHaveBeenCalledWith(
      "Importer une sauvegarde ?",
      expect.any(String),
      expect.anything(),
    );
    expect(onImport).toHaveBeenCalledTimes(1);
    alertSpy.mockRestore();
  });

  it("doesn't show a reminder row when `reminder` is omitted", async () => {
    await render(
      <BackupSettingsScreen onExport={vi.fn()} onImport={vi.fn()} />,
    );
    expect(screen.queryByRole("switch")).not.toBeOnTheScreen();
  });

  it("shows a reminder switch and calls onToggle when pressed", async () => {
    const onToggle = vi.fn();
    await render(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        reminder={{ enabled: false, onToggle, intervalDays: 7 }}
      />,
    );
    expect(
      screen.getByText(
        "Une notification tous les 7 jours pour penser à exporter.",
      ),
    ).toBeOnTheScreen();

    const [nativeSwitch] = screenElements("Switch");
    if (!nativeSwitch) throw new Error("expected the reminder switch");
    await fireEvent(nativeSwitch, "valueChange", true);

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("shows an info box with its label and value when `info` is given", async () => {
    await render(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        info={{
          label: "Dernière sauvegarde auto",
          value: "Aujourd'hui à 08:00",
        }}
      />,
    );
    expect(screen.getByText("Dernière sauvegarde auto")).toBeOnTheScreen();
    expect(screen.getByText("Aujourd'hui à 08:00")).toBeOnTheScreen();
  });

  it("renders a titled section per action when layout is 'sections'", async () => {
    await render(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        layout="sections"
      />,
    );
    expect(screen.getByText("Exporter")).toBeOnTheScreen();
    expect(screen.getByText("Importer")).toBeOnTheScreen();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("shows a leading icon on a button when `icons` sets one for it", async () => {
    await render(
      <BackupSettingsScreen
        onExport={vi.fn()}
        onImport={vi.fn()}
        icons={{ export: "cloud-upload-outline" }}
      />,
    );
    expect(screenIcons()).toEqual(["cloud-upload-outline"]);
  });
});
