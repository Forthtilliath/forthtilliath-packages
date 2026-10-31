import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PickResult } from "@forthtilliath/expo-backup";
import { BackupError } from "@forthtilliath/expo-backup/errors";

import { createFakeManager, type Data } from "./__mocks__/fakeManager.js";
import { allText, flush, press, spyOnAlerts } from "./__mocks__/screen.js";
import { BackupScreen } from "./BackupScreen.js";

afterEach(() => {
  vi.restoreAllMocks();
});

const codeField = () => screen.queryByPlaceholderText("XXXXX-XXXXX-…");

describe("FileSection", () => {
  it("exports, and reports a failure in the user's language", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    await render(<BackupScreen manager={manager} locale="en" />);
    await press("Export my data");
    expect(manager.exportToFile).toHaveBeenCalled();

    manager.exportToFile.mockRejectedValue(
      new BackupError("sharing-unavailable"),
    );
    await press("Export my data");
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
    await render(<BackupScreen manager={manager} />);
    await press("Importer une sauvegarde");
    expect(alerts.last()?.[1]).toBe("Ce n'est pas une sauvegarde GlucoDose.");
  });

  it("imports after confirmation", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.pickBackupFile.mockResolvedValue({
      status: "ready",
      data: { items: ["a"] },
    });
    await render(<BackupScreen manager={manager} />);
    await press("Importer une sauvegarde");
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
    await render(<BackupScreen manager={manager} />);
    await press("Importer une sauvegarde");
    expect(alerts.spy).not.toHaveBeenCalled();

    manager.pickBackupFile.mockResolvedValue({
      status: "ready",
      data: { items: [] },
    });
    await press("Importer une sauvegarde");
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
    await render(<BackupScreen manager={manager} />);

    await press("Importer une sauvegarde");
    const typeCode = async (code: string) => {
      const field = codeField();
      if (!field) throw new Error("expected the recovery code field");
      await fireEvent.changeText(field, code);
      await press("Valider");
    };

    await typeCode("wrong");
    expect(retry).toHaveBeenLastCalledWith("wrong");
    expect(allText()).toContain("ce n'est pas celle qui a chiffré ce fichier");

    await typeCode("right");
    await alerts.tap("Restaurer");
    expect(manager.restore).toHaveBeenCalledWith(
      { items: ["old"] },
      { source: "file" },
    );
    expect(codeField()).not.toBeOnTheScreen();
  });

  it("stops asking when the recovery code input is cancelled", async () => {
    const { manager } = createFakeManager({ encryption: "required" });
    manager.pickBackupFile.mockResolvedValue({
      status: "missing-key",
      retry: vi.fn(),
    });
    await render(<BackupScreen manager={manager} />);
    await press("Importer une sauvegarde");
    await press("Annuler");
    expect(manager.restore).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Valider" }),
    ).not.toBeOnTheScreen();
  });

  it("offers to undo the last restore only when possible", async () => {
    const alerts = spyOnAlerts();
    const { manager, setState } = createFakeManager();
    await render(<BackupScreen manager={manager} />);
    expect(
      screen.queryByRole("button", {
        name: "Annuler la dernière restauration",
      }),
    ).not.toBeOnTheScreen();
    await act(() => {
      setState({ hasSafetyBackup: true, lastBackupAt: Date.UTC(2026, 0, 1) });
    });
    expect(allText()).toContain("2026");
    await press("Annuler la dernière restauration");
    await alerts.tap("Valider");
    expect(manager.undoLastRestore).toHaveBeenCalled();
    await flush();
  });
});
