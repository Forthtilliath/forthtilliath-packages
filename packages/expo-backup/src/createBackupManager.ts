import { AppState } from "react-native";

import { createCloudSync } from "./cloudSync.js";
import { createManagerContext } from "./context.js";
import { createFileBackup } from "./fileBackup.js";
import type { BackupManager, BackupManagerConfig } from "./types.js";

const DEFAULT_AUTO_BACKUP_DELAY_MS = 3000;

/**
 * Creates the backup manager of an app: automatic Google Drive backup, manual
 * file export/import, optional or required encryption with an app-generated
 * key. Create it once, at module level, and call `start()` from the root
 * layout.
 *
 * @example
 * export const backup = createBackupManager({
 *   appId: "glucodose",
 *   encryption: "required",
 *   collect: buildExportedData,
 *   parse: parseBackup,
 *   apply: replaceAllData,
 * });
 */
export function createBackupManager<T>(
  config: BackupManagerConfig<T>,
): BackupManager<T> {
  const ctx = createManagerContext(config);
  const { store, encryption } = ctx;
  const delay = config.autoBackupDelayMs ?? DEFAULT_AUTO_BACKUP_DELAY_MS;

  let timer: ReturnType<typeof setTimeout> | null = null;

  function flush() {
    if (timer) clearTimeout(timer);
    timer = null;
    void cloud.syncNow();
  }

  function schedule() {
    const { hydrated, cloudAccount } = store.getState();
    if (hydrated && !cloudAccount) return;
    if (hydrated) store.setState({ cloudPending: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, delay);
  }

  const cloud = createCloudSync(ctx, { onNeedsSync: schedule });
  const files = createFileBackup(ctx);

  function retryPending() {
    const { cloudAccount, cloudPending } = store.getState();
    if (cloudAccount && cloudPending) flush();
  }

  async function restore(
    data: T,
    { source = "file" }: { source?: "file" | "cloud" } = {},
  ) {
    await ctx.ready();
    await ctx.writeSafetyBackup();
    await config.apply(data);
    const now = Date.now();
    store.setState({
      hasSafetyBackup: true,
      lastBackupAt: Math.max(now, store.getState().lastBackupAt ?? 0),
      // Restored from the cloud: both sides now hold the same data.
      ...(source === "cloud" ? { cloudPending: false, cloudError: null } : {}),
    });
    if (source === "file") schedule();
  }

  return {
    appId: ctx.appId,
    encryptionMode: ctx.mode,
    getState: store.getState,
    subscribe: store.subscribe,

    start() {
      let stopped = false;
      void ctx.ready().then(() => {
        if (!stopped) retryPending();
      });
      // Going to the background: send what was waiting for the delay now, the
      // system may kill the app before. Back to the foreground: retry.
      const subscription = AppState.addEventListener("change", (status) => {
        if (status === "background" && timer) flush();
        if (status === "active") retryPending();
      });
      return () => {
        stopped = true;
        subscription.remove();
        if (timer) clearTimeout(timer);
        timer = null;
      };
    },
    notifyDataChanged: schedule,

    connectCloud: cloud.connect,
    async resolveConflict(conflict, keep) {
      if (keep === "cloud") {
        // Restored before linking, or replacing the data would schedule a
        // pointless upload of what's already in the cloud.
        await restore(conflict.remote, { source: "cloud" });
        await cloud.link(conflict.email, { upload: false });
        store.setState({ lastCloudBackupAt: Date.now() });
      } else {
        await cloud.link(conflict.email, { upload: true });
      }
    },
    async cancelConflict() {
      await ctx.auth.signOut();
    },
    syncNow: cloud.syncNow,
    fetchCloudBackup: cloud.fetchCloudBackup,
    disconnectCloud: cloud.disconnect,

    exportToFile: files.exportToFile,
    pickBackupFile: files.pickBackupFile,
    restore,
    async undoLastRestore() {
      await ctx.ready();
      const data = await ctx.readSafetyBackup();
      await config.apply(data);
      schedule();
      return data;
    },

    isEncryptionActive: encryption.isActive,
    async setEncryptionEnabled(enabled) {
      await ctx.ready();
      if (ctx.mode !== "optional") return;
      store.setState({ encryptionEnabled: enabled });
      // Re-upload so the cloud copy matches the new setting.
      schedule();
    },
    async getRecoveryCode() {
      await ctx.ready();
      return encryption.getRecoveryCode();
    },
    async addRecoveryCode(code) {
      await ctx.ready();
      await encryption.addRecoveryCode(code);
    },
  };
}
