import { File, Paths } from "expo-file-system";

import {
  createEncryption,
  type Encryption,
  type EncryptionMode,
} from "./encryption.js";
import { BackupError, normalizeBackupError } from "./errors.js";
import { type CloudAuth, googleDriveAuth } from "./googleAuth.js";
import { createStateStore, type StateStore } from "./stateStore.js";
import type { BackupManagerConfig } from "./types.js";

const APP_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

/** Everything the cloud and file halves of the manager share. */
export interface ManagerContext<T> {
  appId: string;
  mode: EncryptionMode;
  config: BackupManagerConfig<T>;
  auth: CloudAuth;
  store: StateStore;
  encryption: Encryption;
  /** Resolves once the persisted state is loaded — awaited by every action. */
  ready: () => Promise<void>;
  /** Serialized and, when active, encrypted. */
  writeBackup: (data: T) => Promise<string>;
  /** Decrypted if needed, then validated by the app's `parse`. */
  readBackup: (content: string) => Promise<T>;
  /** Snapshot of the current data, kept to undo the next restore. */
  writeSafetyBackup: () => Promise<void>;
  readSafetyBackup: () => Promise<T>;
}

export function createManagerContext<T>(
  config: BackupManagerConfig<T>,
): ManagerContext<T> {
  const { appId } = config;
  if (!APP_ID_PATTERN.test(appId)) {
    throw new Error(
      `Invalid backup appId "${appId}": use lowercase letters, digits and dashes.`,
    );
  }
  const mode = config.encryption ?? "off";
  const store = createStateStore(appId);
  const encryption = createEncryption({
    appId,
    mode,
    isEnabled: () => store.getState().encryptionEnabled,
  });
  const serialize =
    config.serialize ?? ((data: T) => JSON.stringify(data, null, 2));
  // Paths.document rather than cache: the system may purge the cache when
  // storage runs low, right when a restore went wrong.
  const safetyFile = new File(Paths.document, `${appId}-before-restore.json`);

  let hydration: Promise<void> | null = null;

  async function writeBackup(data: T) {
    return encryption.encode(serialize(data));
  }

  async function readBackup(content: string) {
    let text: string;
    try {
      text = await encryption.decode(content);
    } catch (error) {
      throw normalizeBackupError(error);
    }
    return config.parse(text);
  }

  return {
    appId,
    mode,
    config,
    auth: config.auth ?? googleDriveAuth,
    store,
    encryption,
    ready: () => (hydration ??= store.hydrate()),
    writeBackup,
    readBackup,
    async writeSafetyBackup() {
      const content = await writeBackup(await config.collect());
      if (!safetyFile.exists) safetyFile.create();
      safetyFile.write(content);
    },
    async readSafetyBackup() {
      if (!safetyFile.exists) throw new BackupError("no-safety-backup");
      return readBackup(await safetyFile.text());
    },
  };
}
