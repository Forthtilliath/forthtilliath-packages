import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BackupError } from "@forthtilliath/expo-backup/errors";

import { createFakeManager } from "./__mocks__/fakeManager.js";
import {
  allText,
  elementsOfType,
  flush,
  press,
  spyOnAlerts,
} from "./__mocks__/screen.js";
import { BackupScreen } from "./BackupScreen.js";
import { errorMessage } from "./dialogs.js";
import { useAutoBackup } from "./hooks.js";
import { defaultLabels } from "./labels.js";

afterEach(() => {
  vi.restoreAllMocks();
});

const showCode = () =>
  screen.queryByRole("button", { name: "Afficher la clé de secours" });

describe("EncryptionSection", () => {
  it("is hidden when encryption is off", async () => {
    await render(<BackupScreen manager={createFakeManager().manager} />);
    expect(allText()).not.toContain("Chiffrement");
  });

  it("toggles encryption in optional mode", async () => {
    const { manager, setState } = createFakeManager({ encryption: "optional" });
    await render(<BackupScreen manager={manager} />);
    expect(showCode()).not.toBeOnTheScreen();

    const [nativeSwitch] = elementsOfType("Switch");
    if (!nativeSwitch) throw new Error("expected the encryption switch");
    await fireEvent(nativeSwitch, "valueChange", true);
    await flush();
    expect(manager.setEncryptionEnabled).toHaveBeenCalledWith(true);

    await act(() => {
      setState({ encryptionEnabled: true });
    });
    expect(showCode()).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole("switch", { name: "Chiffrer mes sauvegardes" }),
    );
    await flush();
    expect(manager.setEncryptionEnabled).toHaveBeenLastCalledWith(false);
  });

  it("shows the recovery code on demand in required mode", async () => {
    const { manager } = createFakeManager({ encryption: "required" });
    await render(<BackupScreen manager={manager} />);
    expect(allText()).toContain("toujours chiffrées");
    expect(screen.queryByRole("switch")).not.toBeOnTheScreen();
    expect(allText()).not.toContain("ABCDE-FGHJK");
    await press("Afficher la clé de secours");
    expect(allText()).toContain("ABCDE-FGHJK");
    await press("Fermer");
    expect(allText()).not.toContain("ABCDE-FGHJK");
  });

  it("adds a recovery code typed in", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ encryption: "required" });
    manager.addRecoveryCode.mockRejectedValueOnce(
      new BackupError("invalid-recovery-code"),
    );
    await render(<BackupScreen manager={manager} />);
    const enter = async (code: string) => {
      await press("Saisir une clé de secours");
      await fireEvent.changeText(
        screen.getByPlaceholderText("XXXXX-XXXXX-…"),
        code,
      );
      await press("Valider");
    };
    await enter("typo");
    expect(alerts.last()?.[1]).toBe(
      "Cette clé de secours contient une faute de frappe.",
    );
    await enter("good");
    expect(manager.addRecoveryCode).toHaveBeenLastCalledWith("good");
    expect(alerts.last()?.[0]).toBe("Clé de secours ajoutée.");
  });

  it("lets labels be overridden, errors included", async () => {
    const { manager } = createFakeManager({ encryption: "required" });
    await render(
      <BackupScreen
        manager={manager}
        labels={{
          encryptionTitle: "Protection",
          errors: { network: "Hors ligne" },
        }}
      />,
    );
    expect(allText()).toContain("Protection");
  });
});

describe("helpers", () => {
  it("errorMessage falls back sensibly", () => {
    const t = defaultLabels.en;
    expect(errorMessage(new BackupError("network"), t)).toBe(t.errors.network);
    expect(errorMessage(new Error("custom"), t)).toBe("custom");
    expect(errorMessage("weird", t)).toBe(t.errors.unknown);
  });

  it("useAutoBackup starts the manager and stops it on unmount", async () => {
    const { manager } = createFakeManager();
    const stop = vi.fn();
    manager.start.mockReturnValue(stop);
    const { unmount } = await renderHook(() => {
      useAutoBackup(manager);
    });
    expect(manager.start).toHaveBeenCalledTimes(1);
    await unmount();
    expect(stop).toHaveBeenCalled();
  });
});
