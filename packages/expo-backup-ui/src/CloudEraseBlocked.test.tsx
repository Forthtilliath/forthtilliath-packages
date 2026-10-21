import { afterEach, describe, expect, it, vi } from "vitest";

import { createFakeManager } from "./__mocks__/fakeManager.js";
import {
  allText,
  hasButton,
  press,
  render,
  spyOnAlerts,
} from "./__mocks__/screen.js";
import { BackupScreen } from "./BackupScreen.js";

afterEach(() => {
  vi.restoreAllMocks();
});

const blocked = {
  cloudAccount: { email: "me@example.com" },
  cloudError: "cloud-erase-blocked" as const,
  cloudPending: true,
};

describe("CloudSection — cloud erase blocked", () => {
  it("explains the block and offers to replace the Drive backup", () => {
    const { manager } = createFakeManager({ state: blocked });
    const tree = render(<BackupScreen manager={manager} />);
    expect(allText(tree)).toContain("l'envoi automatique est suspendu");
    expect(hasButton(tree, "Remplacer la sauvegarde Drive")).toBe(true);
  });

  it("hides the replace button otherwise", () => {
    const { manager } = createFakeManager({
      state: { cloudAccount: blocked.cloudAccount, cloudError: "network" },
    });
    const tree = render(<BackupScreen manager={manager} />);
    expect(hasButton(tree, "Remplacer la sauvegarde Drive")).toBe(false);
  });

  it("replaces the Drive backup only after confirmation", async () => {
    const alerts = spyOnAlerts();
    const { manager } = createFakeManager({ state: blocked });
    const tree = render(<BackupScreen manager={manager} />);

    await press(tree, "Remplacer la sauvegarde Drive");
    expect(alerts.last()?.[0]).toBe("Effacer la sauvegarde Google Drive ?");
    await alerts.tap("Annuler");
    expect(manager.confirmCloudErase).not.toHaveBeenCalled();

    await press(tree, "Remplacer la sauvegarde Drive");
    await alerts.tap("Remplacer");
    expect(manager.confirmCloudErase).toHaveBeenCalledTimes(1);
    expect(alerts.last()?.[0]).toBe("Sauvegarde envoyée");
  });
});
