import type { EncryptionMode } from "./encryption.js";
import type { CloudAuth } from "./googleAuth.js";
import type { BackupState } from "./stateStore.js";

/** The app-specific part: what its data is and how to read/replace it. */
export interface BackupSource<T> {
  /** Snapshot of everything to back up (e.g. every table of the database). */
  collect: () => Promise<T> | T;
  /** Defaults to pretty-printed JSON. */
  serialize?: (data: T) => string;
  /**
   * Validates (and migrates, if needed) a backup's text — already decrypted.
   * Throw an `Error` with a user-facing message to reject it: the UI shows
   * it as is.
   */
  parse: (text: string) => Promise<T> | T;
  /** Replaces all local data with `data` (no merge). */
  apply: (data: T) => Promise<void> | void;
  /**
   * Whether a cloud backup holds nothing worth keeping, so linking an
   * account can upload this device's data without asking which to keep.
   * Defaults to never empty (always ask).
   */
  isEmpty?: (data: T) => boolean;
  /**
   * Whether this device holds data worth snapshotting before a restore. When
   * it resolves to false (first launch, new phone), `restore` skips the
   * safety backup — and so never calls `collect` on an empty app — and there
   * is nothing to undo afterwards. Defaults to always true.
   */
  hasLocalData?: () => Promise<boolean> | boolean;
}

export interface BackupManagerConfig<T> extends BackupSource<T> {
  /**
   * Lowercase id used in every file name (`<appId>-backup.json` on Drive…)
   * and in the secure-store key. Never change it once shipped.
   */
  appId: string;
  /** @defaultValue "off" */
  encryption?: EncryptionMode;
  /** Name of the manually exported file. Defaults to `<appId>-backup-YYYY-MM-DD-HHmm.json`. */
  exportFileName?: (date: Date) => string;
  /** Title of the Android share sheet when exporting. */
  exportDialogTitle?: string;
  /**
   * Largest file `pickBackupFile` accepts, checked before reading it.
   * @defaultValue 10 MB
   */
  maxFileBytes?: number;
  /**
   * Delay grouping close changes into one cloud upload. Pending changes are
   * still flushed at once when the app goes to the background.
   * @defaultValue 3000
   */
  autoBackupDelayMs?: number;
  /** @defaultValue googleDriveAuth */
  auth?: CloudAuth;
}

export type ConnectResult<T> =
  | { status: "cancelled" }
  | { status: "connected"; email: string }
  /** A non-empty backup already exists in the cloud: ask which one to keep. */
  | { status: "conflict"; email: string; remote: T };

export type PickResult<T> =
  | { status: "cancelled" }
  | { status: "ready"; data: T }
  /**
   * Encrypted with a key this device doesn't have: ask for the recovery code
   * of the device that wrote it, then call `retry` with it.
   */
  | {
      status: "missing-key";
      retry: (recoveryCode: string) => Promise<PickResult<T>>;
    };

export interface BackupManager<T> {
  readonly appId: string;
  readonly encryptionMode: EncryptionMode;
  getState: () => BackupState;
  subscribe: (listener: () => void) => () => void;
  /** Reads the persisted state, retries a pending upload, watches app state. Returns a stop function. */
  start: () => () => void;
  /** Schedules an automatic cloud upload. Call it whenever backed-up data changes. */
  notifyDataChanged: () => void;

  connectCloud: () => Promise<ConnectResult<T>>;
  /** After a `conflict`: keep this device's data (uploaded) or the cloud's (restored). */
  resolveConflict: (
    conflict: { email: string; remote: T },
    keep: "device" | "cloud",
  ) => Promise<void>;
  /** After a `conflict`: give up linking the account. */
  cancelConflict: () => Promise<void>;
  /** Uploads now. Resolves to false (error kept in the state) instead of throwing. */
  syncNow: () => Promise<boolean>;
  fetchCloudBackup: () => Promise<T | null>;
  disconnectCloud: () => Promise<void>;

  /** Writes a backup file (encrypted when active) and opens the share sheet. */
  exportToFile: () => Promise<void>;
  /** Opens the file picker and reads the chosen backup, without applying it yet. */
  pickBackupFile: () => Promise<PickResult<T>>;
  /** Replaces local data with `data`, keeping a snapshot of the current data to undo. */
  restore: (data: T, options?: { source?: "file" | "cloud" }) => Promise<void>;
  /** Puts back the data as it was just before the last `restore`. */
  undoLastRestore: () => Promise<T>;

  isEncryptionActive: () => boolean;
  /** `optional` mode only. Re-uploads the cloud backup in the new form. */
  setEncryptionEnabled: (enabled: boolean) => Promise<void>;
  getRecoveryCode: () => Promise<string>;
  addRecoveryCode: (code: string) => Promise<void>;
}
