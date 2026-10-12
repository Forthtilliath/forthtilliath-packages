import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { isEncryptedBackup } from "@forthtilliath/backup-crypto";

import { device, emitAppState, resetDevice } from "./__mocks__/fakeDevice.js";
import { createFakeDrive, type FakeDrive } from "./__mocks__/fakeDrive.js";
import { createFakeAuth, createTestApp } from "./__mocks__/testApp.js";
import { BackupError } from "./errors.js";

let drive: FakeDrive;

beforeEach(() => {
  resetDevice();
  drive = createFakeDrive();
  vi.stubGlobal("fetch", drive.fetch);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("connectCloud", () => {
  it("links the account and uploads when the cloud is empty", async () => {
    const { manager } = createTestApp(["a"]);
    await expect(manager.connectCloud()).resolves.toEqual({
      status: "connected",
      email: "me@example.com",
    });
    expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
      items: ["a"],
    });
    expect(manager.getState()).toMatchObject({
      cloudAccount: { email: "me@example.com" },
      cloudPending: false,
      cloudError: null,
    });
    expect(manager.getState().lastCloudBackupAt).not.toBeNull();
    // Nothing encrypted, nothing to escrow.
    expect(drive.contentOf("testapp-backup-keyring.json")).toBeUndefined();
  });

  it("encrypts the cloud copy and escrows the key when encryption is required", async () => {
    const { manager } = createTestApp(["secret"], { encryption: "required" });
    await manager.connectCloud();
    const content = drive.contentOf("testapp-backup.json") ?? "";
    expect(isEncryptedBackup(content)).toBe(true);
    expect(content).not.toContain("secret");
    expect(drive.contentOf("testapp-backup-keyring.json")).toBeDefined();
  });

  it("lets a new phone read the encrypted backup with nothing but the account", async () => {
    await createTestApp(["old phone"], {
      encryption: "required",
    }).manager.connectCloud();

    resetDevice(); // new phone: no file, no key — same Google account
    const { manager, app } = createTestApp([], { encryption: "required" });
    const result = await manager.connectCloud();
    expect(result).toMatchObject({
      status: "conflict",
      remote: { items: ["old phone"] },
    });
    if (result.status !== "conflict") return;

    await manager.resolveConflict(result, "cloud");
    expect(app.data).toEqual({ items: ["old phone"] });
    expect(manager.getState()).toMatchObject({
      cloudAccount: { email: "me@example.com" },
    });
    expect(await manager.getRecoveryCode()).toBeTruthy();
  });

  it("uploads this device's data when the conflict is resolved for the device", async () => {
    await createTestApp(["cloud"]).manager.connectCloud();
    resetDevice();
    const { manager } = createTestApp(["device"]);
    const result = await manager.connectCloud();
    if (result.status !== "conflict") throw new Error("expected a conflict");
    await manager.resolveConflict(result, "device");
    expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
      items: ["device"],
    });
  });

  it("doesn't ask when the cloud backup is empty", async () => {
    await createTestApp([]).manager.connectCloud();
    resetDevice();
    const { manager } = createTestApp(["new"]);
    await expect(manager.connectCloud()).resolves.toMatchObject({
      status: "connected",
    });
  });

  it("signs out when the conflict is cancelled", async () => {
    const { manager, auth } = createTestApp(["a"]);
    await manager.cancelConflict();
    expect(auth.signOut).toHaveBeenCalled();
  });

  it("does nothing when sign-in is cancelled", async () => {
    const auth = createFakeAuth();
    auth.signIn.mockResolvedValue(null);
    const { manager } = createTestApp(["a"], { auth });
    await expect(manager.connectCloud()).resolves.toEqual({
      status: "cancelled",
    });
    expect(manager.getState().cloudAccount).toBeNull();
  });

  it("signs out and reports a coded error when Drive refuses", async () => {
    const { manager, auth } = createTestApp(["a"]);
    drive.failNext(403, "accessNotConfigured");
    await expect(manager.connectCloud()).rejects.toMatchObject({
      code: "drive-api-disabled",
    });
    expect(auth.signOut).toHaveBeenCalled();
    expect(manager.getState().cloudAccount).toBeNull();
  });
});

describe("syncNow", () => {
  it("returns false without a linked account", async () => {
    await expect(createTestApp(["a"]).manager.syncNow()).resolves.toBe(false);
  });

  it("keeps the error and the pending flag instead of throwing", async () => {
    const { manager } = createTestApp(["a"]);
    await manager.connectCloud();
    drive.failNext(500);
    await expect(manager.syncNow()).resolves.toBe(false);
    expect(manager.getState()).toMatchObject({
      cloudPending: true,
      cloudError: "drive-unavailable",
    });
    await expect(manager.syncNow()).resolves.toBe(true);
    expect(manager.getState().cloudError).toBeNull();
  });

  it("retries once with a fresh token after a 401", async () => {
    const { manager, auth } = createTestApp(["a"]);
    await manager.connectCloud();
    drive.failNext(401);
    await expect(manager.syncNow()).resolves.toBe(true);
    expect(auth.invalidateToken).toHaveBeenCalledWith("token");
  });

  it("runs again after an upload when a change came in during it", async () => {
    const { manager, app } = createTestApp(["a"]);
    await manager.connectCloud();
    app.data = { items: ["b"] };
    const first = manager.syncNow();
    await expect(manager.syncNow()).resolves.toBe(false); // already syncing
    await first;
    await vi.waitFor(() => {
      expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
        items: ["b"],
      });
    });
  });
});

describe("automatic backup", () => {
  it("uploads after the delay, and only when linked", async () => {
    const { manager, app } = createTestApp(["a"], { autoBackupDelayMs: 1000 });
    const stop = manager.start();
    await manager.connectCloud();
    vi.useFakeTimers();
    app.data = { items: ["b"] };
    manager.notifyDataChanged();
    expect(manager.getState().cloudPending).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();
    await vi.waitFor(() => {
      expect(manager.getState().cloudPending).toBe(false);
    });
    expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
      items: ["b"],
    });

    await manager.disconnectCloud();
    manager.notifyDataChanged();
    expect(manager.getState().cloudPending).toBe(false);
    stop();
  });

  it("flushes when the app goes to the background and retries when it comes back", async () => {
    const { manager, app } = createTestApp(["a"], {
      autoBackupDelayMs: 60_000,
    });
    const stop = manager.start();
    await manager.connectCloud();
    app.data = { items: ["b"] };
    manager.notifyDataChanged();
    emitAppState("background");
    await vi.waitFor(() => {
      expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
        items: ["b"],
      });
    });

    drive.failNext(500);
    await manager.syncNow();
    expect(manager.getState().cloudPending).toBe(true);
    emitAppState("active");
    await vi.waitFor(() => {
      expect(manager.getState().cloudPending).toBe(false);
    });
    stop();
    expect(device.appStateListeners.size).toBe(0);
  });

  it("restores the linked account across restarts", async () => {
    await createTestApp(["a"]).manager.connectCloud();
    const { manager } = createTestApp(["a"]);
    manager.start()();
    await vi.waitFor(() => {
      expect(manager.getState()).toMatchObject({
        hydrated: true,
        cloudAccount: { email: "me@example.com" },
      });
    });
  });
});

describe("fetchCloudBackup", () => {
  it("returns null when nothing was uploaded yet, the backup otherwise", async () => {
    const { manager } = createTestApp(["a"]);
    await expect(manager.fetchCloudBackup()).resolves.toBeNull();
    await manager.connectCloud();
    await expect(manager.fetchCloudBackup()).resolves.toEqual({ items: ["a"] });
  });

  it("normalizes network errors", async () => {
    const { manager } = createTestApp(["a"]);
    vi.stubGlobal("fetch", () =>
      Promise.reject(new TypeError("Network request failed")),
    );
    const error: unknown = await manager
      .fetchCloudBackup()
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(BackupError);
    expect((error as BackupError).code).toBe("network");
  });
});
