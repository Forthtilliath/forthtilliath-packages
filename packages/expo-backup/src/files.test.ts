import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { isEncryptedBackup } from "@forthtilliath/backup-crypto";

import { device, resetDevice } from "./__mocks__/fakeDevice.js";
import { createFakeDrive, type FakeDrive } from "./__mocks__/fakeDrive.js";
import { createTestApp } from "./__mocks__/testApp.js";
import { defaultExportFileName } from "./fileBackup.js";

let drive: FakeDrive;

beforeEach(() => {
  resetDevice();
  drive = createFakeDrive();
  vi.stubGlobal("fetch", drive.fetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function lastSharedContent() {
  const uri = device.shared.at(-1);
  return uri === undefined ? undefined : device.files.get(uri);
}

describe("exportToFile", () => {
  it("shares a plain JSON file and records the backup", async () => {
    const { manager } = createTestApp(["a"]);
    await manager.exportToFile();
    expect(JSON.parse(lastSharedContent() ?? "")).toEqual({ items: ["a"] });
    expect(device.shared[0]).toMatch(
      /^cache\/testapp-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/,
    );
    expect(manager.getState().lastBackupAt).not.toBeNull();
  });

  it("encrypts the file when encryption is required", async () => {
    const { manager } = createTestApp(["secret"], { encryption: "required" });
    await manager.exportToFile();
    const content = lastSharedContent() ?? "";
    expect(isEncryptedBackup(content)).toBe(true);
    expect(content).not.toContain("secret");
  });

  it("uses the app's file name", async () => {
    const { manager } = createTestApp(["a"], {
      exportFileName: () => "sauvegarde.json",
      exportDialogTitle: "Exporter",
    });
    await manager.exportToFile();
    await manager.exportToFile();
    expect(device.shared).toEqual([
      "cache/sauvegarde.json",
      "cache/sauvegarde.json",
    ]);
  });

  it("fails clearly without a share sheet", async () => {
    device.sharingAvailable = false;
    await expect(
      createTestApp(["a"]).manager.exportToFile(),
    ).rejects.toMatchObject({
      code: "sharing-unavailable",
    });
  });

  it("names files after the local date", () => {
    expect(defaultExportFileName("x", new Date(2026, 0, 5, 9, 7))).toBe(
      "x-backup-2026-01-05-0907.json",
    );
  });
});

describe("pickBackupFile", () => {
  it("returns cancelled when nothing is picked", async () => {
    await expect(createTestApp([]).manager.pickBackupFile()).resolves.toEqual({
      status: "cancelled",
    });
  });

  it("reads plain exports, even when encryption is required", async () => {
    device.pickedContent = JSON.stringify({ items: ["plain"] });
    const { manager } = createTestApp([], { encryption: "required" });
    await expect(manager.pickBackupFile()).resolves.toEqual({
      status: "ready",
      data: { items: ["plain"] },
    });
  });

  it("lets the app's own validation message through", async () => {
    device.pickedContent = JSON.stringify({ nope: true });
    await expect(createTestApp([]).manager.pickBackupFile()).rejects.toThrow(
      "Not a test app backup.",
    );
  });

  it("asks for the recovery code of a file from another phone", async () => {
    const old = createTestApp(["from old phone"], { encryption: "required" });
    await old.manager.exportToFile();
    const exported = lastSharedContent() ?? "";
    const recoveryCode = await old.manager.getRecoveryCode();
    const otherCode = await createTestApp([], {
      encryption: "required",
      appId: "otherapp",
    }).manager.getRecoveryCode();

    resetDevice();
    device.pickedContent = exported;
    const { manager } = createTestApp([], { encryption: "required" });
    const result = await manager.pickBackupFile();
    if (result.status !== "missing-key")
      throw new Error("expected missing-key");

    await expect(result.retry("not a code")).rejects.toMatchObject({
      code: "invalid-recovery-code",
    });
    await expect(result.retry(otherCode)).rejects.toMatchObject({
      code: "recovery-code-mismatch",
    });
    await expect(result.retry(recoveryCode.toLowerCase())).resolves.toEqual({
      status: "ready",
      data: { items: ["from old phone"] },
    });
  });

  it("reports a damaged encrypted file as corrupted", async () => {
    const { manager } = createTestApp(["a"], { encryption: "required" });
    await manager.exportToFile();
    const envelope = JSON.parse(lastSharedContent() ?? "") as Record<
      string,
      string
    >;
    device.pickedContent = JSON.stringify({ ...envelope, ciphertext: "AAAA" });
    await expect(manager.pickBackupFile()).rejects.toMatchObject({
      code: "corrupted",
    });
  });
});

describe("restore / undoLastRestore", () => {
  it("replaces the data and can put the previous data back", async () => {
    const { manager, app } = createTestApp(["before"], {
      encryption: "required",
    });
    await manager.restore({ items: ["after"] });
    expect(app.data).toEqual({ items: ["after"] });
    expect(manager.getState().hasSafetyBackup).toBe(true);
    // Encrypted on disk too.
    expect(
      isEncryptedBackup(
        device.files.get("document/testapp-before-restore.json") ?? "",
      ),
    ).toBe(true);

    await expect(manager.undoLastRestore()).resolves.toEqual({
      items: ["before"],
    });
    expect(app.data).toEqual({ items: ["before"] });
  });

  it("fails clearly when there is nothing to undo", async () => {
    await expect(
      createTestApp([]).manager.undoLastRestore(),
    ).rejects.toMatchObject({
      code: "no-safety-backup",
    });
  });

  it("uploads a file restore to the cloud when linked", async () => {
    const { manager } = createTestApp(["a"], { autoBackupDelayMs: 0 });
    await manager.connectCloud();
    await manager.restore({ items: ["imported"] });
    await vi.waitFor(() => {
      expect(JSON.parse(drive.contentOf("testapp-backup.json") ?? "")).toEqual({
        items: ["imported"],
      });
    });
  });
});

describe("encryption settings", () => {
  it("only encrypts in optional mode once enabled", async () => {
    const { manager } = createTestApp(["a"], { encryption: "optional" });
    expect(manager.isEncryptionActive()).toBe(false);
    await manager.setEncryptionEnabled(true);
    expect(manager.isEncryptionActive()).toBe(true);
    await manager.exportToFile();
    expect(isEncryptedBackup(lastSharedContent() ?? "")).toBe(true);
  });

  it("ignores the toggle outside optional mode", async () => {
    const off = createTestApp(["a"]).manager;
    await off.setEncryptionEnabled(true);
    expect(off.isEncryptionActive()).toBe(false);
    const required = createTestApp(["a"], { encryption: "required" }).manager;
    await required.setEncryptionEnabled(false);
    expect(required.isEncryptionActive()).toBe(true);
  });

  it("keeps the same recovery code, and accepts another device's", async () => {
    const { manager } = createTestApp([], { encryption: "required" });
    const code = await manager.getRecoveryCode();
    expect(await manager.getRecoveryCode()).toBe(code);
    const other = await createTestApp([], {
      appId: "otherapp",
    }).manager.getRecoveryCode();
    await manager.addRecoveryCode(other);
    await expect(manager.addRecoveryCode("12345")).rejects.toMatchObject({
      code: "invalid-recovery-code",
    });
  });

  it("escrows a key generated while linked", async () => {
    const { manager } = createTestApp(["a"], {
      encryption: "optional",
      autoBackupDelayMs: 0,
    });
    await manager.connectCloud();
    expect(drive.contentOf("testapp-backup-keyring.json")).toBeUndefined();
    await manager.setEncryptionEnabled(true);
    await vi.waitFor(() => {
      expect(
        isEncryptedBackup(drive.contentOf("testapp-backup.json") ?? ""),
      ).toBe(true);
    });
    expect(drive.contentOf("testapp-backup-keyring.json")).toBeDefined();
  });
});

it("rejects an app id unsafe for file names", () => {
  expect(() => createTestApp([], { appId: "../etc" })).toThrow(
    /Invalid backup appId/,
  );
});
