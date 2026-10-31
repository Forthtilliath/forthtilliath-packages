import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildReleaseRemovedPermissionsManifest } from "./transforms.js";
import withReleaseRemovedPermissions from "./withReleaseRemovedPermissions.js";

interface Mod {
  modRequest: { platformProjectRoot: string };
}
type Action = (mod: Mod) => Promise<Mod>;

// withDangerousMod only schedules the action: capture it to run it on a temp dir.
const scheduled: { action?: Action } = {};
vi.mock("expo/config-plugins", () => ({
  withDangerousMod: (config: unknown, [, action]: [string, Action]) => {
    scheduled.action = action;
    return config;
  },
}));

describe("buildReleaseRemovedPermissionsManifest", () => {
  it("removes INTERNET by default", () => {
    const manifest = buildReleaseRemovedPermissionsManifest();
    expect(manifest).toContain(
      '<uses-permission android:name="android.permission.INTERNET" tools:node="remove"/>',
    );
    expect(manifest).toContain(
      'xmlns:tools="http://schemas.android.com/tools"',
    );
  });

  it("accepts short and full names, once each", () => {
    const manifest = buildReleaseRemovedPermissionsManifest([
      "INTERNET",
      "android.permission.INTERNET",
      "com.google.android.gms.permission.AD_ID",
    ]);
    expect(manifest.match(/uses-permission/g)).toHaveLength(2);
    expect(manifest).toContain(
      'android:name="com.google.android.gms.permission.AD_ID"',
    );
  });

  it("refuses an empty list and anything but a permission name", () => {
    expect(() => buildReleaseRemovedPermissionsManifest([])).toThrow(/empty/);
    for (const bad of ['INTERNET"/><evil', "a b", "", ".X", "X."]) {
      expect(() => buildReleaseRemovedPermissionsManifest([bad])).toThrow(
        /invalid/,
      );
    }
  });
});

describe("withReleaseRemovedPermissions", () => {
  let root: string;
  const manifestPath = () => join(root, "app/src/release/AndroidManifest.xml");

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "release-perms-"));
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  async function run(options?: { permissions?: string[] }) {
    withReleaseRemovedPermissions({ name: "app", slug: "app" }, options);
    if (!scheduled.action) throw new Error("no mod scheduled");
    await scheduled.action({ modRequest: { platformProjectRoot: root } });
  }

  it("writes the release manifest, and rewrites its own", async () => {
    await run();
    expect(await readFile(manifestPath(), "utf8")).toBe(
      buildReleaseRemovedPermissionsManifest(),
    );
    await run({ permissions: ["INTERNET", "ACCESS_NETWORK_STATE"] });
    expect(await readFile(manifestPath(), "utf8")).toContain(
      "ACCESS_NETWORK_STATE",
    );
  });

  it("refuses to overwrite a manifest it didn't generate", async () => {
    await mkdir(join(root, "app/src/release"), { recursive: true });
    await writeFile(manifestPath(), "<manifest>custom</manifest>");
    await expect(run()).rejects.toThrow(/already exists/);
    expect(await readFile(manifestPath(), "utf8")).toBe(
      "<manifest>custom</manifest>",
    );
  });

  it("fails before writing anything on invalid options", async () => {
    await expect(run({ permissions: ["<x>"] })).rejects.toThrow(/invalid/);
    await expect(readFile(manifestPath(), "utf8")).rejects.toThrow();
  });
});
