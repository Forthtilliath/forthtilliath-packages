import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { readEncryptedBackup } from "@forthtilliath/backup-crypto";

import type { ManagerContext } from "./context.js";
import { BackupError, normalizeBackupError } from "./errors.js";
import type { PickResult } from "./types.js";

const DEFAULT_MAX_FILE_BYTES = 10 * 1024 * 1024;

// Depending on the phone and the app holding it, a `.json` file is reported
// as JSON, plain text or raw bytes: with JSON alone, the picker may hide it.
const PICKER_MIME_TYPES = [
  "application/json",
  "text/plain",
  "application/octet-stream",
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function defaultExportFileName(appId: string, date: Date): string {
  const day = `${date.getFullYear().toString()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${appId}-backup-${day}-${pad(date.getHours())}${pad(date.getMinutes())}.json`;
}

export interface FileBackup<T> {
  exportToFile: () => Promise<void>;
  pickBackupFile: () => Promise<PickResult<T>>;
}

/** The manual half of the manager: a file handed to the share sheet, read back through the file picker. */
export function createFileBackup<T>(ctx: ManagerContext<T>): FileBackup<T> {
  const { config, store, encryption } = ctx;

  async function read(content: string): Promise<PickResult<T>> {
    try {
      return { status: "ready", data: await ctx.readBackup(content) };
    } catch (error) {
      const normalized = normalizeBackupError(error);
      if (
        !(normalized instanceof BackupError) ||
        normalized.code !== "missing-key"
      ) {
        throw normalized;
      }
      const { keyId } = readEncryptedBackup(content);
      return {
        status: "missing-key",
        retry: async (recoveryCode) => {
          await encryption.addRecoveryCode(recoveryCode, keyId);
          return read(content);
        },
      };
    }
  }

  return {
    /**
     * Counts as a backup for `lastBackupAt` even if the user closes the share
     * sheet without picking a destination: Android doesn't tell them apart.
     */
    async exportToFile() {
      await ctx.ready();
      if (!(await Sharing.isAvailableAsync()))
        throw new BackupError("sharing-unavailable");
      const now = new Date();
      const content = await ctx.writeBackup(await config.collect());
      const name =
        config.exportFileName?.(now) ?? defaultExportFileName(ctx.appId, now);
      // App cache: private to the app and never part of Android's backup.
      const file = new File(Paths.cache, name);
      if (file.exists) file.delete();
      file.create();
      file.write(content);
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        ...(config.exportDialogTitle
          ? { dialogTitle: config.exportDialogTitle }
          : {}),
      });
      store.setState({
        lastBackupAt: Math.max(
          now.getTime(),
          store.getState().lastBackupAt ?? 0,
        ),
      });
    },
    async pickBackupFile() {
      await ctx.ready();
      const picked = await File.pickFileAsync({ mimeTypes: PICKER_MIME_TYPES });
      if (picked.canceled) return { status: "cancelled" };
      const maxBytes = config.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
      // `size` is 0 when the provider doesn't report it: the length is
      // checked again once read (a UTF-16 length never exceeds the bytes).
      if (picked.result.size > maxBytes)
        throw new BackupError("file-too-large");
      const content = await picked.result.text();
      if (content.length > maxBytes) throw new BackupError("file-too-large");
      return read(content);
    },
  };
}
