import type { BackupErrorCode } from "@forthtilliath/expo-backup";

import { enLabels } from "./labels.en.js";
import { frLabels } from "./labels.fr.js";

/** Languages the built-in labels are available in. */
export type BackupLocale = "fr" | "en";

/** Every text of the screen. Pass a partial object in `labels` to override some. */
export interface BackupScreenLabels {
  cloudTitle: string;
  cloudHint: string;
  connectButton: string;
  connectedTitle: string;
  connectedConfirm: (email: string) => string;
  lastCloudBackup: (date: string) => string;
  cloudPending: string;
  autoHint: string;
  syncNowButton: string;
  restoreCloudButton: string;
  disconnectButton: string;
  disconnectConfirmTitle: string;
  disconnectConfirmMessage: string;
  conflictTitle: string;
  conflictMessage: (description: string) => string;
  conflictKeepDevice: string;
  conflictKeepCloud: string;
  noCloudBackupTitle: string;
  noCloudBackupMessage: string;

  fileTitle: string;
  lastBackup: (date: string) => string;
  fileHint: string;
  fileHintEncrypted: string;
  exportButton: string;
  importButton: string;
  undoButton: string;
  undoConfirmTitle: string;
  undoConfirmMessage: string;
  undoneTitle: string;

  restoreConfirmTitle: string;
  restoreConfirmMessage: (description: string) => string;
  restoreConfirmButton: string;
  restoredTitle: string;
  restoredMessage: string;

  encryptionTitle: string;
  encryptionToggle: string;
  encryptionOptionalHint: string;
  encryptionRequiredHint: string;
  showRecoveryCodeButton: string;
  enterRecoveryCodeButton: string;
  recoveryCodeTitle: string;
  recoveryCodeHint: string;
  recoveryCodeInputTitle: string;
  recoveryCodeInputHint: string;
  recoveryCodePlaceholder: string;
  recoveryCodeAdded: string;

  /** Shown when the app's `describeBackup` isn't given. */
  defaultDescription: string;
  never: string;
  cancel: string;
  confirm: string;
  close: string;
  errorTitle: string;
  errors: Record<BackupErrorCode, string>;
}

/** What `labels` accepts: any subset of the texts, error messages included. */
export type BackupScreenLabelOverrides = Partial<
  Omit<BackupScreenLabels, "errors">
> & {
  errors?: Partial<BackupScreenLabels["errors"]>;
};

export const defaultLabels: Record<BackupLocale, BackupScreenLabels> = {
  fr: frLabels,
  en: enLabels,
};

export function resolveLabels(
  locale: BackupLocale,
  overrides: BackupScreenLabelOverrides | undefined,
): BackupScreenLabels {
  const base = defaultLabels[locale];
  return {
    ...base,
    ...overrides,
    errors: { ...base.errors, ...overrides?.errors },
  };
}
