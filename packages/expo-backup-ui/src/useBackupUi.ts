import { useRef, useState } from "react";
import { Alert } from "react-native";

import type { BackupManager, BackupState } from "@forthtilliath/expo-backup";

import { askConfirmation, showError } from "./dialogs.js";
import { useBackupState } from "./hooks.js";
import type { BackupScreenLabels } from "./labels.js";
import type { MergedStyles } from "./styles.js";

/** What every section of the screen shares. */
export interface BackupUi<T> {
  manager: BackupManager<T>;
  state: BackupState;
  t: BackupScreenLabels;
  styles: MergedStyles;
  /** One action at a time for the whole screen: a second tap is ignored, errors are alerted. */
  busy: boolean;
  run: (action: () => Promise<void>) => Promise<void>;
  describe: (data: T) => string;
  formatDate: (epochMs: number | null) => string;
  /** Confirms with a description of `data`, restores it, tells the user. */
  confirmAndRestore: (data: T, source: "file" | "cloud") => Promise<void>;
  /** Opens the recovery-code input; null if the user closes it. */
  askRecoveryCode: (error?: string) => Promise<string | null>;
}

export interface RecoveryPrompt {
  error: string | undefined;
  resolve: (code: string | null) => void;
}

export function useBackupUi<T>({
  manager,
  t,
  styles,
  describeBackup,
  dateLocale,
  onRestored,
}: {
  manager: BackupManager<T>;
  t: BackupScreenLabels;
  styles: MergedStyles;
  describeBackup: ((data: T) => string) | undefined;
  dateLocale: string;
  onRestored: ((data: T) => void) | undefined;
}): { ui: BackupUi<T>; recoveryPrompt: RecoveryPrompt | null } {
  const state = useBackupState(manager);
  const [busy, setBusy] = useState(false);
  // A ref, not `busy`: two taps handled before the re-render would both
  // still read the stale `false`.
  const inFlightRef = useRef(false);
  const [recoveryPrompt, setRecoveryPrompt] = useState<RecoveryPrompt | null>(
    null,
  );

  async function run(action: () => Promise<void>) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      showError(error, t);
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  }

  const describe = (data: T) => describeBackup?.(data) ?? t.defaultDescription;

  async function confirmAndRestore(data: T, source: "file" | "cloud") {
    const confirmed = await askConfirmation(
      t,
      t.restoreConfirmTitle,
      t.restoreConfirmMessage(describe(data)),
      t.restoreConfirmButton,
    );
    if (!confirmed) return;
    await manager.restore(data, { source });
    Alert.alert(t.restoredTitle, t.restoredMessage);
    onRestored?.(data);
  }

  function askRecoveryCode(error?: string) {
    return new Promise<string | null>((resolve) => {
      setRecoveryPrompt({
        error,
        resolve: (code) => {
          setRecoveryPrompt(null);
          resolve(code);
        },
      });
    });
  }

  return {
    ui: {
      manager,
      state,
      t,
      styles,
      busy,
      run,
      describe,
      formatDate: (epochMs) =>
        epochMs === null
          ? t.never
          : new Date(epochMs).toLocaleString(dateLocale),
      confirmAndRestore,
      askRecoveryCode,
    },
    recoveryPrompt,
  };
}
