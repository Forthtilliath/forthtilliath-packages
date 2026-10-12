/* eslint-disable @typescript-eslint/no-deprecated -- see __mocks__/renderHook.ts */
import { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BackupError } from "@forthtilliath/expo-backup/errors";

import { createFakeManager } from "./__mocks__/fakeManager.js";
import {
  allText,
  flush,
  hasButton,
  press,
  render,
  spyOnAlerts,
} from "./__mocks__/screen.js";
import { BackupScreen } from "./BackupScreen.js";

afterEach(() => {
  vi.restoreAllMocks();
});

const linked = { cloudAccount: { email: "me@example.com" } };

describe("CloudSection — not linked", () => {
  it("links the account and confirms", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.connectCloud.mockResolvedValue({
      status: "connected",
      email: "me@example.com",
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Connecter Google Drive");
    expect(alerts.last()?.[0]).toBe("Sauvegarde automatique activée");
  });

  it("asks which backup to keep on a conflict", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    const conflict = {
      status: "conflict" as const,
      email: "me@example.com",
      remote: { items: ["x"] },
    };
    manager.connectCloud.mockResolvedValue(conflict);
    const tree = render(
      <BackupScreen
        manager={manager}
        describeBackup={(data) => `${data.items.length} item`}
      />,
    );
    await press(tree, "Connecter Google Drive");
    expect(alerts.last()?.[1]).toContain("1 item");
    await alerts.tap("Google Drive");
    expect(manager.resolveConflict).toHaveBeenCalledWith(conflict, "cloud");
  });

  it("gives up linking when the conflict is cancelled", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.connectCloud.mockResolvedValue({
      status: "conflict",
      email: "e",
      remote: { items: [] },
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Connecter Google Drive");
    await alerts.tap("Annuler");
    expect(manager.cancelConflict).toHaveBeenCalled();
    expect(manager.resolveConflict).not.toHaveBeenCalled();
  });

  it("shows a localized error", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.connectCloud.mockRejectedValue(
      new BackupError("oauth-misconfigured"),
    );
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Connecter Google Drive");
    expect(alerts.last()).toEqual(["Erreur", expect.stringContaining("SHA-1")]);
  });

  it("does nothing when sign-in is cancelled", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager();
    manager.connectCloud.mockResolvedValue({ status: "cancelled" });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Connecter Google Drive");
    expect(alerts.spy).not.toHaveBeenCalled();
  });

  it("can be hidden", () => {
    const { manager } = createFakeManager();
    const tree = render(<BackupScreen manager={manager} cloud={false} />);
    expect(hasButton(tree, "Connecter Google Drive")).toBe(false);
  });
});

describe("CloudSection — linked", () => {
  it("shows the account, the pending upload and the last error", () => {
    const { manager, setState } = createFakeManager({
      state: { ...linked, cloudPending: true, lastCloudBackupAt: 0 },
    });
    const tree = render(<BackupScreen manager={manager} />);
    expect(allText(tree)).toContain("me@example.com");
    expect(allText(tree)).toContain("envoi en attente");
    act(() => {
      setState({ cloudError: "network" });
    });
    expect(allText(tree)).toContain("Pas de connexion internet.");
    expect(allText(tree)).not.toContain("envoi en attente");
  });

  it("uploads on demand", async () => {
    const { manager } = createFakeManager({ state: linked });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Sauvegarder maintenant");
    expect(manager.syncNow).toHaveBeenCalled();
  });

  it("restores from the cloud after confirmation", async () => {
    const alerts = spyOnAlerts();
    const onRestored = vi.fn();
    const { manager } = createFakeManager({ state: linked });
    manager.fetchCloudBackup.mockResolvedValue({ items: ["a"] });
    const tree = render(
      <BackupScreen manager={manager} onRestored={onRestored} />,
    );
    await press(tree, "Restaurer depuis Google Drive");
    await alerts.tap("Restaurer");
    expect(manager.restore).toHaveBeenCalledWith(
      { items: ["a"] },
      { source: "cloud" },
    );
    expect(onRestored).toHaveBeenCalledWith({ items: ["a"] });
    expect(alerts.last()?.[0]).toBe("Restauration terminée");
  });

  it("says so when the cloud is empty", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ state: linked });
    manager.fetchCloudBackup.mockResolvedValue(null);
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Restaurer depuis Google Drive");
    expect(alerts.last()?.[0]).toBe("Aucune sauvegarde");
  });

  it("disconnects only after confirmation", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ state: linked });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Déconnecter");
    await alerts.tap("Annuler");
    expect(manager.disconnectCloud).not.toHaveBeenCalled();
    await press(tree, "Déconnecter");
    await alerts.tap("Déconnecter");
    expect(manager.disconnectCloud).toHaveBeenCalled();
  });

  it("ignores a second tap while an action runs", async () => {
    let finish!: () => void;
    const { manager } = createFakeManager({ state: linked });
    manager.syncNow.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => {
            resolve(true);
          };
        }),
    );
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Sauvegarder maintenant");
    await press(tree, "Sauvegarder maintenant");
    expect(manager.syncNow).toHaveBeenCalledTimes(1);
    finish();
    await flush();
  });
});
