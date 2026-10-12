import { vi } from "vitest";

import { createBackupManager } from "../createBackupManager.js";
import type { EncryptionMode } from "../encryption.js";
import type { CloudAuth } from "../googleAuth.js";
import type { BackupManagerConfig } from "../types.js";

export interface AppData {
  items: string[];
}

export function createFakeAuth(email = "me@example.com") {
  return {
    signIn: vi.fn<CloudAuth["signIn"]>(() => Promise.resolve(email)),
    getAccessToken: vi.fn<CloudAuth["getAccessToken"]>(() =>
      Promise.resolve("token"),
    ),
    invalidateToken: vi.fn<CloudAuth["invalidateToken"]>(() =>
      Promise.resolve(),
    ),
    signOut: vi.fn<CloudAuth["signOut"]>(() => Promise.resolve()),
  };
}

/** A tiny app whose whole data is a list of strings, wired to a backup manager. */
export function createTestApp(
  items: string[],
  {
    encryption = "off",
    auth = createFakeAuth(),
    ...rest
  }: {
    encryption?: EncryptionMode;
    auth?: ReturnType<typeof createFakeAuth>;
  } & Partial<BackupManagerConfig<AppData>> = {},
) {
  const app: { data: AppData } = { data: { items } };
  const apply = vi.fn((data: AppData) => {
    app.data = data;
  });
  const manager = createBackupManager<AppData>({
    appId: "testapp",
    encryption,
    auth,
    collect: () => app.data,
    parse: (text) => {
      const parsed = JSON.parse(text) as Partial<AppData>;
      if (!Array.isArray(parsed.items))
        throw new Error("Not a test app backup.");
      return { items: parsed.items };
    },
    apply,
    isEmpty: (data) => data.items.length === 0,
    ...rest,
  });
  return { app, apply, auth, manager };
}
