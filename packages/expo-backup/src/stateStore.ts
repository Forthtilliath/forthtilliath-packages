import { File, Paths } from "expo-file-system";

import type { BackupErrorCode } from "./errors.js";
import { writeFileSync } from "./writeFile.js";

/**
 * Everything the backup screen shows, persisted in a small JSON file of the
 * app's documents (no secret in it). Read it with `getState` / `subscribe`, or
 * `useBackupState` of `@forthtilliath/expo-backup-ui`.
 */
export interface BackupState {
  /** False until the persisted state has been read back at startup. */
  hydrated: boolean;
  /** Linked cloud account, null when the automatic cloud backup is off. */
  cloudAccount: { email: string } | null;
  /** The user's choice in `optional` encryption mode. */
  encryptionEnabled: boolean;
  /**
   * Last successful backup by any means (file export, cloud, restore). Epoch
   * ms.
   */
  lastBackupAt: number | null;
  /** Last successful cloud upload. Epoch ms, `null` if never. */
  lastCloudBackupAt: number | null;
  /**
   * Data changed since the last successful cloud upload (e.g. while offline).
   */
  cloudPending: boolean;
  /** Why the last cloud upload failed, cleared by the next success. */
  cloudError: BackupErrorCode | null;
  /**
   * Technical cause of `cloudError` ("HTTP 403 · storageQuotaExceeded"), for
   * diagnosis.
   */
  cloudErrorDetail: string | null;
  /**
   * When uploads started failing (first failure since the last success). Epoch
   * ms.
   */
  cloudFailingSince: number | null;
  /** A pre-restore snapshot exists, so the last restore can be undone. */
  hasSafetyBackup: boolean;
}

type PersistedState = Omit<BackupState, "hydrated">;

/**
 * Patch that forgets a cloud failure (success, account unlinked…).
 * @internal
 */
export const noCloudError = {
  cloudError: null,
  cloudErrorDetail: null,
  cloudFailingSince: null,
} satisfies Partial<PersistedState>;

/**
 * State before anything is read back from disk (`hydrated: false`, no account,
 * no backup).
 */
export const initialBackupState: BackupState = {
  hydrated: false,
  cloudAccount: null,
  encryptionEnabled: false,
  lastBackupAt: null,
  lastCloudBackupAt: null,
  cloudPending: false,
  ...noCloudError,
  hasSafetyBackup: false,
};

const STATE_VERSION = 1;

/**
 * The persisted backup state of one manager (see {@link createStateStore}).
 * @internal
 */
export interface StateStore {
  /** The current state (a new object after each change). */
  getState: () => BackupState;
  /**
   * Only after {@link StateStore.hydrate}: earlier, it would overwrite what's
   * on disk.
   */
  setState: (patch: Partial<PersistedState>) => void;
  /** Calls `listener` after every change; returns the unsubscribe function. */
  subscribe: (listener: () => void) => () => void;
  /** Reads the persisted state back from disk; a no-op once hydrated. */
  hydrate: () => Promise<void>;
}

/**
 * Small persisted store (a JSON file in the app's documents) with the
 * `subscribe`/`getState` shape `useSyncExternalStore` expects — no state
 * library imposed on the app. Holds no secret: the e-mail of the linked
 * account at most.
 * @internal
 */
export function createStateStore(appId: string): StateStore {
  const file = new File(Paths.document, `${appId}-backup-state.json`);
  let state = initialBackupState;
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  function persist() {
    const persisted: Partial<BackupState> = { ...state };
    delete persisted.hydrated;
    try {
      if (!file.exists) file.create();
      writeFileSync(
        file,
        JSON.stringify({ version: STATE_VERSION, state: persisted }),
      );
    } catch {
      // Best effort: losing these flags only means re-checking at next start.
    }
  }

  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...patch };
      persist();
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    async hydrate() {
      if (state.hydrated) return;
      let persisted: Partial<PersistedState> = {};
      try {
        if (file.exists) {
          const parsed = JSON.parse(await file.text()) as {
            version?: number;
            state?: Partial<PersistedState>;
          };
          if (parsed.version === STATE_VERSION && parsed.state)
            persisted = parsed.state;
        }
      } catch {
        // Unreadable: start from scratch rather than block the app.
      }
      state = { ...initialBackupState, ...persisted, hydrated: true };
      emit();
    },
  };
}
