import { useEffect, useSyncExternalStore } from "react";

import type { BackupManager, BackupState } from "@forthtilliath/expo-backup";
// Subpath: pure module, no native peer loaded.
import {
  type CloudBackupProblem,
  type CloudBackupProblemOptions,
  getCloudBackupProblem,
} from "@forthtilliath/expo-backup/cloudBackupProblem";

/** The manager's state (linked account, last backup, pending upload…), re-rendering on change. */
export function useBackupState<T>(manager: BackupManager<T>): BackupState {
  return useSyncExternalStore(manager.subscribe, manager.getState);
}

/**
 * The automatic backup's failure to tell the user about outside the backup
 * screen (banner, alert, tab badge), or null — see `getCloudBackupProblem`.
 * Turn its code into text with `codeMessage`.
 */
export function useCloudBackupProblem<T>(
  manager: BackupManager<T>,
  options?: CloudBackupProblemOptions,
): CloudBackupProblem | null {
  return getCloudBackupProblem(useBackupState(manager), options);
}

/**
 * Starts the manager for the component's lifetime: reads the persisted state,
 * retries a pending upload, flushes when the app goes to the background.
 * Mount it once, in the root layout.
 */
export function useAutoBackup<T>(manager: BackupManager<T>): void {
  useEffect(() => manager.start(), [manager]);
}
