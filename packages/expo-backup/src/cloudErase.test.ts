import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetDevice } from "./__mocks__/fakeDevice.js";
import { createFakeDrive, type FakeDrive } from "./__mocks__/fakeDrive.js";
import { createTestApp } from "./__mocks__/testApp.js";
import { getCloudBackupProblem } from "./cloudBackupProblem.js";

let drive: FakeDrive;

beforeEach(() => {
  resetDevice();
  drive = createFakeDrive();
  vi.stubGlobal("fetch", drive.fetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function cloudItems() {
  return (
    JSON.parse(drive.contentOf("testapp-backup.json") ?? "{}") as {
      items?: string[];
    }
  ).items;
}

/** A linked app whose cloud backup holds `["a", "b"]`. */
async function linkedApp() {
  const test = createTestApp(["a", "b"]);
  await test.manager.connectCloud();
  return test;
}

describe("cloud erase guard", () => {
  it("refuses to replace a cloud backup holding data with empty data", async () => {
    const { app, manager } = await linkedApp();
    app.data = { items: [] };

    await expect(manager.syncNow()).resolves.toBe(false);

    expect(cloudItems()).toEqual(["a", "b"]);
    expect(manager.getState()).toMatchObject({
      cloudError: "cloud-erase-blocked",
      cloudPending: true,
    });
    expect(getCloudBackupProblem(manager.getState())?.code).toBe(
      "cloud-erase-blocked",
    );
  });

  it("keeps refusing once blocked, even after new data", async () => {
    const { app, manager } = await linkedApp();
    app.data = { items: [] };
    await manager.syncNow();

    app.data = { items: ["new"] };
    await expect(manager.syncNow()).resolves.toBe(false);
    expect(cloudItems()).toEqual(["a", "b"]);
  });

  it("uploads the empty data once the user confirms the erase", async () => {
    const { app, manager } = await linkedApp();
    app.data = { items: [] };
    await manager.syncNow();

    await expect(manager.confirmCloudErase()).resolves.toBe(true);
    expect(cloudItems()).toEqual([]);
    expect(manager.getState().cloudError).toBeNull();

    // Back to normal: later uploads go through.
    app.data = { items: ["new"] };
    await expect(manager.syncNow()).resolves.toBe(true);
    expect(cloudItems()).toEqual(["new"]);
  });

  it("lifts the block when the user restores the cloud backup", async () => {
    const { app, manager } = await linkedApp();
    app.data = { items: [] };
    await manager.syncNow();

    const remote = await manager.fetchCloudBackup();
    if (!remote) throw new Error("expected a cloud backup");
    await manager.restore(remote, { source: "cloud" });

    expect(app.data).toEqual({ items: ["a", "b"] });
    expect(manager.getState().cloudError).toBeNull();
    await expect(manager.syncNow()).resolves.toBe(true);
  });

  it("lets empty data replace an empty cloud backup", async () => {
    const { app, manager } = createTestApp([]);
    await manager.connectCloud();
    app.data = { items: [] };
    await expect(manager.syncNow()).resolves.toBe(true);
  });

  it("treats an unreadable cloud backup as holding data", async () => {
    const { app, manager } = await linkedApp();
    const file = [...drive.files.values()].find(
      (f) => f.name === "testapp-backup.json",
    );
    if (!file) throw new Error("expected the cloud backup");
    file.content = "not a backup";
    app.data = { items: [] };

    await expect(manager.syncNow()).resolves.toBe(false);
    expect(manager.getState().cloudError).toBe("cloud-erase-blocked");
  });

  it("does nothing without isEmpty", async () => {
    const { app, manager } = createTestApp(["a"], { isEmpty: undefined });
    await manager.connectCloud();
    app.data = { items: [] };
    await expect(manager.syncNow()).resolves.toBe(true);
  });
});
