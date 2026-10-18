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

  it("says the first upload failed instead of confirming", async () => {
    const alerts = spyOnAlerts();
    const { manager, setState } = createFakeManager();
    manager.connectCloud.mockImplementation(() => {
      setState({
        ...linked,
        cloudError: "drive-storage-full",
        cloudErrorDetail: "HTTP 403 · storageQuotaExceeded",
      });
      return Promise.resolve({ status: "connected", email: "me@example.com" });
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Connecter Google Drive");
    expect(alerts.last()).toEqual([
      "Compte relié, mais l'envoi a échoué",
      expect.stringMatching(
        /stockage Google est plein[\s\S]*Détail technique : HTTP 403 · storageQuotaExceeded/,
      ),
    ]);
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

  it("shows since when uploads fail and the technical detail", () => {
    const { manager } = createFakeManager({
      state: {
        ...linked,
        cloudError: "drive-storage-full",
        cloudErrorDetail: "HTTP 403 · storageQuotaExceeded",
        cloudFailingSince: 0,
      },
    });
    const text = allText(render(<BackupScreen manager={manager} />));
    expect(text).toContain("stockage Google est plein");
    expect(text).toContain("Les envois échouent depuis le");
    expect(text).toContain(
      "Détail technique : HTTP 403 · storageQuotaExceeded",
    );
  });

  it("falls back to the generic message for a code it doesn't know", () => {
    const { manager } = createFakeManager({
      state: { ...linked, cloudError: "from-a-newer-version" as "unknown" },
    });
    expect(allText(render(<BackupScreen manager={manager} />))).toContain(
      "Une erreur inattendue est survenue.",
    );
  });

  it("uploads on demand and confirms", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ state: linked });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Sauvegarder maintenant");
    expect(manager.syncNow).toHaveBeenCalled();
    expect(alerts.last()?.[0]).toBe("Sauvegarde envoyée");
  });

  it("explains why an upload on demand failed", async () => {
    const alerts = spyOnAlerts();
    const { manager, setState } = createFakeManager({ state: linked });
    manager.syncNow.mockImplementation(() => {
      setState({ cloudError: "reconnect-required" });
      return Promise.resolve(false);
    });
    const tree = render(<BackupScreen manager={manager} />);
    await press(tree, "Sauvegarder maintenant");
    expect(alerts.last()).toEqual([
      "La sauvegarde n'a pas pu être envoyée",
      expect.stringContaining("Déconnecter"),
    ]);
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
