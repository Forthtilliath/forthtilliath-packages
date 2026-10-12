import { beforeEach, describe, expect, it, vi } from "vitest";

import { BackupCryptoError } from "@forthtilliath/backup-crypto";

import { device, resetDevice } from "./__mocks__/fakeDevice.js";
import { createTestApp } from "./__mocks__/testApp.js";
import {
  BackupError,
  backupErrorCode,
  normalizeBackupError,
} from "./errors.js";
import { DriveError } from "./googleDrive.js";

beforeEach(() => {
  resetDevice();
});

describe("normalizeBackupError", () => {
  it.each([
    [
      new DriveError("", 403, "insufficientPermissions"),
      "drive-permission-missing",
    ],
    [new DriveError("", 401), "drive-access-denied"],
    [new DriveError("", 503), "drive-unavailable"],
    [new BackupCryptoError("unsupported-version"), "newer-format"],
    [new BackupCryptoError("not-encrypted"), "corrupted"],
    [new TypeError("Network request failed"), "network"],
  ])("maps %o to %s", (error, code) => {
    expect(backupErrorCode(error)).toBe(code);
  });

  it("keeps BackupErrors and the app's own errors as they are", () => {
    const backupError = new BackupError("missing-key");
    const appError = new Error("Fichier invalide");
    expect(normalizeBackupError(backupError)).toBe(backupError);
    expect(normalizeBackupError(appError)).toBe(appError);
    expect(backupErrorCode(appError)).toBe("unknown");
  });
});

describe("persisted state", () => {
  it("starts from scratch when the state file is unreadable or outdated", async () => {
    device.files.set("document/testapp-backup-state.json", "{not json");
    const { manager } = createTestApp([]);
    manager.start()();
    await vi.waitFor(() => {
      expect(manager.getState()).toMatchObject({
        hydrated: true,
        cloudAccount: null,
      });
    });

    device.files.set(
      "document/testapp-backup-state.json",
      JSON.stringify({ version: 99, state: { cloudAccount: { email: "x" } } }),
    );
    const other = createTestApp([]).manager;
    other.start()();
    await vi.waitFor(() => {
      expect(other.getState()).toMatchObject({
        hydrated: true,
        cloudAccount: null,
      });
    });
  });

  it("notifies subscribers until they unsubscribe", async () => {
    const { manager } = createTestApp(["a"]);
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);
    await manager.restore({ items: ["b"] });
    expect(listener).toHaveBeenCalled();
    listener.mockClear();
    unsubscribe();
    await manager.restore({ items: ["c"] });
    expect(listener).not.toHaveBeenCalled();
  });

  it("refuses to read a damaged keyring rather than replacing it", async () => {
    device.secureStore.set("forthtilliath-backup.testapp.keyring", "garbage");
    const { manager } = createTestApp(["a"], { encryption: "required" });
    await expect(manager.exportToFile()).rejects.toMatchObject({
      code: "corrupted",
    });
  });
});
