import {
  type BackupKeyring,
  emptyKeyring,
  mergeKeyrings,
  parseKeyring,
  sameKeyring,
  serializeKeyring,
} from "@forthtilliath/backup-crypto";

import type { ManagerContext } from "./context.js";
import {
  backupErrorCode,
  backupErrorDetail,
  normalizeBackupError,
} from "./errors.js";
import {
  downloadAppDataFile,
  DriveError,
  findAppDataFile,
  uploadAppDataFile,
} from "./googleDrive.js";
import { noCloudError } from "./stateStore.js";
import type { ConnectResult } from "./types.js";

export interface CloudSync<T> {
  connect: () => Promise<ConnectResult<T>>;
  /** Links the account without asking (after a conflict was resolved). */
  link: (email: string, options: { upload: boolean }) => Promise<void>;
  syncNow: () => Promise<boolean>;
  fetchCloudBackup: () => Promise<T | null>;
  disconnect: () => Promise<void>;
}

/**
 * The Drive half of the manager. Two files in the app folder: the backup
 * itself, overwritten on every upload (a full snapshot, no history), and the
 * keyring escrow, so a new device signed in to the same account can read the
 * encrypted backups without the user having to keep anything.
 */
export function createCloudSync<T>(
  ctx: ManagerContext<T>,
  { onNeedsSync }: { onNeedsSync: () => void },
): CloudSync<T> {
  const { auth, store, encryption, config } = ctx;
  const backupName = `${ctx.appId}-backup.json`;
  const keyringName = `${ctx.appId}-backup-keyring.json`;

  // The keyring is reconciled with the cloud once per session, then only
  // when it changes locally (key generated, recovery code added).
  let keyringDirty = true;
  let mergingKeyring = false;
  encryption.onKeyringChange(() => {
    if (mergingKeyring) return;
    keyringDirty = true;
    onNeedsSync();
  });

  /** Runs a Drive call, retrying once with a fresh token if Drive rejects it (401). */
  async function withToken<R>(call: (token: string) => Promise<R>): Promise<R> {
    const token = await auth.getAccessToken();
    try {
      return await call(token);
    } catch (error) {
      if (!(error instanceof DriveError) || error.status !== 401) throw error;
      await auth.invalidateToken(token);
      return call(await auth.getAccessToken());
    }
  }

  /**
   * Union of the local and cloud keyrings, the cloud's current key winning so
   * every device converges on it. Must run before uploading anything
   * encrypted: a backup whose key isn't escrowed yet couldn't be read
   * anywhere else.
   */
  async function syncKeyring(token: string): Promise<void> {
    const local = await encryption.loadKeyring();
    const file = await findAppDataFile(token, keyringName);
    let remote: BackupKeyring = emptyKeyring;
    if (file) {
      try {
        remote = parseKeyring(await downloadAppDataFile(token, file.id));
      } catch (error) {
        throw normalizeBackupError(error);
      }
    }
    const merged = encryption.ensureKeyIfActive(mergeKeyrings(remote, local));
    if (!sameKeyring(merged, local)) {
      mergingKeyring = true;
      try {
        await encryption.saveKeyring(merged);
      } finally {
        mergingKeyring = false;
      }
    }
    if (merged.keys.length > 0 && !sameKeyring(merged, remote)) {
      await uploadAppDataFile(
        token,
        keyringName,
        serializeKeyring(merged),
        file?.id ?? null,
      );
    }
    keyringDirty = false;
  }

  async function downloadBackup(token: string): Promise<T | null> {
    const file = await findAppDataFile(token, backupName);
    if (!file) return null;
    return ctx.readBackup(await downloadAppDataFile(token, file.id));
  }

  async function upload(): Promise<void> {
    const startedAt = Date.now();
    const data = await config.collect();
    await withToken(async (token) => {
      if (keyringDirty || encryption.isActive()) await syncKeyring(token);
      const content = await ctx.writeBackup(data);
      const existing = await findAppDataFile(token, backupName);
      await uploadAppDataFile(token, backupName, content, existing?.id ?? null);
    });
    store.setState({
      lastCloudBackupAt: startedAt,
      lastBackupAt: Math.max(startedAt, store.getState().lastBackupAt ?? 0),
      cloudPending: false,
      ...noCloudError,
    });
  }

  let syncing = false;
  let syncAgain = false;

  /**
   * One upload at a time: a change made during an upload triggers another
   * one at the end, so the cloud never keeps an older snapshot than the
   * device. Errors are kept in the state, never thrown, and the upload stays
   * pending until the next try.
   */
  async function syncNow(): Promise<boolean> {
    await ctx.ready();
    if (!store.getState().cloudAccount) return false;
    if (syncing) {
      syncAgain = true;
      return false;
    }
    syncing = true;
    try {
      await upload();
      return true;
    } catch (error) {
      store.setState({
        cloudPending: true,
        cloudError: backupErrorCode(error),
        cloudErrorDetail: backupErrorDetail(error),
        cloudFailingSince: store.getState().cloudFailingSince ?? Date.now(),
      });
      return false;
    } finally {
      syncing = false;
      if (syncAgain) {
        syncAgain = false;
        store.setState({ cloudPending: true });
        void syncNow();
      }
    }
  }

  async function link(
    email: string,
    { upload: shouldUpload }: { upload: boolean },
  ) {
    store.setState({ cloudAccount: { email }, ...noCloudError });
    if (shouldUpload) await syncNow();
  }

  return {
    /**
     * Links a Google account. If a backup already exists in the cloud (new
     * phone, reinstall…), nothing is uploaded before the user chooses: an
     * automatic upload would overwrite it with this device's (maybe empty)
     * data.
     */
    async connect() {
      await ctx.ready();
      const email = await auth.signIn();
      if (!email) return { status: "cancelled" };

      let remote: T | null;
      try {
        remote = await withToken(async (token) => {
          await syncKeyring(token);
          return downloadBackup(token);
        });
      } catch (error) {
        await auth.signOut();
        throw normalizeBackupError(error);
      }

      if (remote !== null && !(config.isEmpty?.(remote) ?? false)) {
        return { status: "conflict", email, remote };
      }
      await link(email, { upload: true });
      return { status: "connected", email };
    },
    link,
    syncNow,
    async fetchCloudBackup() {
      await ctx.ready();
      try {
        return await withToken(async (token) => {
          if (keyringDirty) await syncKeyring(token);
          return downloadBackup(token);
        });
      } catch (error) {
        throw normalizeBackupError(error);
      }
    },
    /** Unlinks the account: the cloud backup stays, the app just stops reaching it. */
    async disconnect() {
      await ctx.ready();
      await auth.signOut();
      store.setState({
        cloudAccount: null,
        cloudPending: false,
        ...noCloudError,
      });
    },
  };
}
