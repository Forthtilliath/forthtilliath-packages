/* eslint-disable @typescript-eslint/no-deprecated -- see __mocks__/renderHook.ts */
import { TextInput } from "react-native";
import { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PickResult } from "@forthtilliath/expo-backup";
import { BackupError } from "@forthtilliath/expo-backup/errors";

import { createFakeManager, type Data } from "./__mocks__/fakeManager.js";
import {
  allText,
  flush,
  hasButton,
  press,
  render,
  spyOnAlerts,
} from "./__mocks__/screen.js";
import { propsOf } from "./__mocks__/testInstance.js";
import { BackupScreen } from "./BackupScreen.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("FileSection", () => {
  it("exports, and reports a failure in the user's language", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    const tree = render(<BackupScreen manager={manager} locale="en" />);
    await press(tree, "Export my data");
    expect(manager.exportToFile).toHaveBeenCalled();

    manager.exportToFile.mockRejectedValue(
      new BackupError("sharing-unavailable"),
    );
    await press(tree, "Export my data");
    expect(alerts.last()).toEqual([
      "Error",
      "File sharing isn't available on this device.",
    ]);
  });

  it("shows the app's own validation message as is", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.pickBackupFile.mockRejectedValue(
      new Error("Ce n'est pas une sauvegarde GlucoDose."),
    );
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Importer une sauvegarde");
    expect(alerts.last()?.[1]).toBe("Ce n'est pas une sauvegarde GlucoDose.");
  });

  it("imports after confirmation", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.pickBackupFile.mockResolvedValue({
      status: "ready",
      data: { items: ["a"] },
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Importer une sauvegarde");
    expect(alerts.last()?.[1]).toContain("données de l'app");
    await alerts.tap("Restaurer");
    expect(manager.restore).toHaveBeenCalledWith(
      { items: ["a"] },
      { source: "file" },
    );
  });

  it("does nothing when the picker is cancelled or the restore declined", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.pickBackupFile.mockResolvedValue({ status: "cancelled" });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Importer une sauvegarde");
    expect(alerts.spy).not.toHaveBeenCalled();

    manager.pickBackupFile.mockResolvedValue({
      status: "ready",
      data: { items: [] },
    });
    await press(tree, "Importer une sauvegarde");
    await alerts.tap("Annuler");
    expect(manager.restore).not.toHaveBeenCalled();
  });

  it("asks for the recovery code until it fits", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ encryption: "required" });
    const retry = vi.fn<(code: string) => Promise<PickResult<Data>>>();
    retry
      .mockRejectedValueOnce(new BackupError("recovery-code-mismatch"))
      .mockResolvedValueOnce({ status: "ready", data: { items: ["old"] } });
    manager.pickBackupFile.mockResolvedValue({ status: "missing-key", retry });
    const tree = render(<BackupScreen manager={manager} />);

    await press(tree, "Importer une sauvegarde");
    const typeCode = async (code: string) => {
      act(() => {
        propsOf<{ onChangeText: (text: string) => void }>(
          tree.root.findByType(TextInput),
        ).onChangeText(code);
      });
      await press(tree, "Valider");
    };

    await typeCode("wrong");
    expect(retry).toHaveBeenLastCalledWith("wrong");
    expect(allText(tree)).toContain(
      "ce n'est pas celle qui a chiffré ce fichier",
    );

    await typeCode("right");
    await alerts.tap("Restaurer");
    expect(manager.restore).toHaveBeenCalledWith(
      { items: ["old"] },
      { source: "file" },
    );
    expect(tree.root.findAllByType(TextInput)).toHaveLength(0);
  });

  it("stops asking when the recovery code input is cancelled", async () => {
    const { manager } = createFakeManager({ encryption: "required" });
    manager.pickBackupFile.mockResolvedValue({
      status: "missing-key",
      retry: vi.fn(),
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Importer une sauvegarde");
    await press(tree, "Annuler");
    expect(manager.restore).not.toHaveBeenCalled();
    expect(hasButton(tree, "Valider")).toBe(false);
  });

  it("offers to undo the last restore only when possible", async () => {
    const alerts = spyOnAlerts();
    const { manager, setState } = createFakeManager();
    const tree = render(<BackupScreen manager={manager} />);
    expect(hasButton(tree, "Annuler la dernière restauration")).toBe(false);
    act(() => {
      setState({ hasSafetyBackup: true, lastBackupAt: Date.UTC(2026, 0, 1) });
    });
    expect(allText(tree)).toContain("2026");
    await press(tree, "Annuler la dernière restauration");
    await alerts.tap("Valider");
    expect(manager.undoLastRestore).toHaveBeenCalled();
    await flush();
  });
});
