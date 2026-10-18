/* eslint-disable @typescript-eslint/no-deprecated -- see __mocks__/renderHook.ts */
import { Switch, TextInput } from "react-native";
import { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BackupError } from "@forthtilliath/expo-backup/errors";

import { createFakeManager } from "./__mocks__/fakeManager.js";
import { renderHook } from "./__mocks__/renderHook.js";
import {
  allText,
  hasButton,
  press,
  render,
  spyOnAlerts,
} from "./__mocks__/screen.js";
import { propsOf } from "./__mocks__/testInstance.js";
import { BackupScreen } from "./BackupScreen.js";
import { errorMessage } from "./dialogs.js";
import { useAutoBackup } from "./hooks.js";
import { defaultLabels } from "./labels.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EncryptionSection", () => {
  it("is hidden when encryption is off", () => {
    const tree = render(<BackupScreen manager={createFakeManager().manager} />);
    expect(allText(tree)).not.toContain("Chiffrement");
  });

  it("toggles encryption in optional mode", async () => {
    const { manager, setState } = createFakeManager({ encryption: "optional" });
    const tree = render(<BackupScreen manager={manager} />);
    expect(hasButton(tree, "Afficher la clé de secours")).toBe(false);
    await act(async () => {
      propsOf<{ onValueChange: (value: boolean) => void }>(
        tree.root.findByType(Switch),
      ).onValueChange(true);
      await Promise.resolve();
    });
    expect(manager.setEncryptionEnabled).toHaveBeenCalledWith(true);
    act(() => {
      setState({ encryptionEnabled: true });
    });
    expect(hasButton(tree, "Afficher la clé de secours")).toBe(true);
    await press(tree, "Chiffrer mes sauvegardes");
    expect(manager.setEncryptionEnabled).toHaveBeenLastCalledWith(false);
  });

  it("shows the recovery code on demand in required mode", async () => {
    const { manager } = createFakeManager({ encryption: "required" });
    const tree = render(<BackupScreen manager={manager} />);
    expect(allText(tree)).toContain("toujours chiffrées");
    expect(tree.root.findAllByType(Switch)).toHaveLength(0);
    expect(allText(tree)).not.toContain("ABCDE-FGHJK");
    await press(tree, "Afficher la clé de secours");
    expect(allText(tree)).toContain("ABCDE-FGHJK");
    await press(tree, "Fermer");
    expect(allText(tree)).not.toContain("ABCDE-FGHJK");
  });

  it("adds a recovery code typed in", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ encryption: "required" });
    manager.addRecoveryCode.mockRejectedValueOnce(
      new BackupError("invalid-recovery-code"),
    );
    const tree = render(<BackupScreen manager={manager} />);
    const enter = async (code: string) => {
      await press(tree, "Saisir une clé de secours");
      act(() => {
        propsOf<{ onChangeText: (text: string) => void }>(
          tree.root.findByType(TextInput),
        ).onChangeText(code);
      });
      await press(tree, "Valider");
    };
    await enter("typo");
    expect(alerts.last()?.[1]).toBe(
      "Cette clé de secours contient une faute de frappe.",
    );
    await enter("good");
    expect(manager.addRecoveryCode).toHaveBeenLastCalledWith("good");
    expect(alerts.last()?.[0]).toBe("Clé de secours ajoutée.");
  });

  it("lets labels be overridden, errors included", () => {
    const { manager } = createFakeManager({ encryption: "required" });
    const tree = render(
      <BackupScreen
        manager={manager}
        labels={{
          encryptionTitle: "Protection",
          errors: { network: "Hors ligne" },
        }}
      />,
    );
    expect(allText(tree)).toContain("Protection");
  });
});

describe("helpers", () => {
  it("errorMessage falls back sensibly", () => {
    const t = defaultLabels.en;
    expect(errorMessage(new BackupError("network"), t)).toBe(t.errors.network);
    expect(errorMessage(new Error("custom"), t)).toBe("custom");
    expect(errorMessage("weird", t)).toBe(t.errors.unknown);
  });

  it("useAutoBackup starts the manager and stops it on unmount", () => {
    const { manager } = createFakeManager();
    const stop = vi.fn();
    manager.start.mockReturnValue(stop);
    const { unmount } = renderHook(() => {
      useAutoBackup(manager);
    });
    expect(manager.start).toHaveBeenCalledTimes(1);
    unmount();
    expect(stop).toHaveBeenCalled();
  });
});
