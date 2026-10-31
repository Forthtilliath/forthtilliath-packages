import { render, screen } from "@testing-library/react-native";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createFakeManager } from "./__mocks__/fakeManager.js";
import { allText, press, spyOnAlerts } from "./__mocks__/screen.js";
import { BackupScreen } from "./BackupScreen.js";

afterEach(() => {
  vi.restoreAllMocks();
});

const blocked = {
  cloudAccount: { email: "me@example.com" },
  cloudError: "cloud-erase-blocked" as const,
  cloudPending: true,
};

const replaceButton = () =>
  screen.queryByRole("button", { name: "Remplacer la sauvegarde Drive" });

describe("CloudSection — cloud erase blocked", () => {
  it("explains the block and offers to replace the Drive backup", async () => {
    const { manager } = createFakeManager({ state: blocked });
    await render(<BackupScreen manager={manager} />);
    expect(allText()).toContain("l'envoi automatique est suspendu");
    expect(replaceButton()).toBeOnTheScreen();
  });

  it("hides the replace button otherwise", async () => {
    const { manager } = createFakeManager({
      state: { cloudAccount: blocked.cloudAccount, cloudError: "network" },
    });
    await render(<BackupScreen manager={manager} />);
    expect(replaceButton()).not.toBeOnTheScreen();
  });

  it("replaces the Drive backup only after confirmation", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ state: blocked });
    await render(<BackupScreen manager={manager} />);

    await press("Remplacer la sauvegarde Drive");
    expect(alerts.last()?.[0]).toBe("Effacer la sauvegarde Google Drive ?");
    await alerts.tap("Annuler");
    expect(manager.confirmCloudErase).not.toHaveBeenCalled();

    await press("Remplacer la sauvegarde Drive");
    await alerts.tap("Remplacer");
    expect(manager.confirmCloudErase).toHaveBeenCalledTimes(1);
    expect(alerts.last()?.[0]).toBe("Sauvegarde envoyée");
  });
});
