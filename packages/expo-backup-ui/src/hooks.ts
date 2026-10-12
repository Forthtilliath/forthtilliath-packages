import { useEffect, useSyncExternalStore } from "react";

import type { BackupManager, BackupState } from "@forthtilliath/expo-backup";

/** The manager's state (linked account, last backup, pending upload…), re-rendering on change. */
export function useBackupState<T>(manager: BackupManager<T>): BackupState {
  return useSyncExternalStore(manager.subscribe, manager.getState);
}

/**
 * Starts the manager for the component's lifetime: reads the persisted state,
 * retries a pending upload, flushes when the app goes to the background.
 * Mount it once, in the root layout.
 */
export function useAutoBackup<T>(manager: BackupManager<T>): void {
  useEffect(() => manager.start(), [manager]);
}
