import type { BackupErrorCode } from "@forthtilliath/expo-backup";

import { enLabels } from "./labels.en.js";
import { frLabels } from "./labels.fr.js";

/** Languages the built-in labels are available in. */
export type BackupLocale = "fr" | "en";

/**
 * Every text of the screen. Pass a partial object in `labels` to override some.
 */
export interface BackupScreenLabels {
  /** Title of the Google Drive section. */
  cloudTitle: string;
  /** Explanation under it while no account is linked. */
  cloudHint: string;
  /** Button linking a Google account. */
  connectButton: string;
  /** Title of the alert confirming the account was linked. */
  connectedTitle: string;
  /** Message of that alert, from the account's email. */
  connectedConfirm: (email: string) => string;
  /**
   * Account linked, but its first upload failed: shown instead of
   * `connectedTitle`.
   */
  connectedButFailedTitle: string;
  /**
   * Status line of a linked account, from the formatted date of the last
   * upload.
   */
  lastCloudBackup: (date: string) => string;
  /** Appended to that line while changes wait for an upload (offline…). */
  cloudPending: string;
  /** Line under a failure, from the formatted date uploads started failing. */
  failingSince: (date: string) => string;
  /** Title of the alert after a successful "Back up now". */
  syncDoneTitle: string;
  /** Message of that alert. */
  syncDoneMessage: string;
  /**
   * Title of the alert after a failed "Back up now" (the message is the
   * error's).
   */
  syncFailedTitle: string;
  /** Line reminding that uploads are automatic. */
  autoHint: string;
  /** Button uploading right away. */
  syncNowButton: string;
  /** Button restoring the Google Drive backup. */
  restoreCloudButton: string;
  /** Button unlinking the account. */
  disconnectButton: string;
  /** Title of the confirmation before unlinking. */
  disconnectConfirmTitle: string;
  /** Message of that confirmation. */
  disconnectConfirmMessage: string;
  /**
   * Title of the choice shown when the linked account already holds a backup
   * with data.
   */
  conflictTitle: string;
  /** Message of that choice, from the description of the cloud backup. */
  conflictMessage: (description: string) => string;
  /** Choice keeping this device's data (uploaded over the cloud backup). */
  conflictKeepDevice: string;
  /** Choice keeping the cloud backup (restored on this device). */
  conflictKeepCloud: string;
  /** Title of the alert when there is nothing to restore from the cloud. */
  noCloudBackupTitle: string;
  /** Message of that alert. */
  noCloudBackupMessage: string;
  /**
   * Shown only after `cloud-erase-blocked`: overwrite the cloud backup anyway.
   */
  eraseCloudButton: string;
  /**
   * Title of the confirmation before overwriting the cloud backup with an empty
   * device.
   */
  eraseCloudConfirmTitle: string;
  /** Message of that confirmation. */
  eraseCloudConfirmMessage: string;
  /** Its confirm button. */
  eraseCloudConfirmButton: string;

  /** Title of the manual backup section. */
  fileTitle: string;
  /** Status line, from the formatted date of the last backup of any kind. */
  lastBackup: (date: string) => string;
  /** Explanation of the section, when files are not encrypted. */
  fileHint: string;
  /** Explanation of the section, when files are encrypted. */
  fileHintEncrypted: string;
  /** Button writing a backup file and opening the share sheet. */
  exportButton: string;
  /** Button opening the file picker to restore a backup. */
  importButton: string;
  /** Button undoing the last restore (shown only when one can be undone). */
  undoButton: string;
  /** Title of the confirmation before undoing. */
  undoConfirmTitle: string;
  /** Message of that confirmation. */
  undoConfirmMessage: string;
  /** Alert once the previous data is back. */
  undoneTitle: string;

  /** Title of the confirmation before a restore (file or cloud). */
  restoreConfirmTitle: string;
  /** Message of that confirmation, from the description of the backup. */
  restoreConfirmMessage: (description: string) => string;
  /** Its confirm button. */
  restoreConfirmButton: string;
  /** Title of the alert after a restore. */
  restoredTitle: string;
  /** Message of that alert. */
  restoredMessage: string;

  /** Title of the encryption section. */
  encryptionTitle: string;
  /** Label of the switch, in `optional` mode. */
  encryptionToggle: string;
  /** Explanation of the section in `optional` mode. */
  encryptionOptionalHint: string;
  /** Explanation of the section in `required` mode. */
  encryptionRequiredHint: string;
  /** Button showing the recovery code. */
  showRecoveryCodeButton: string;
  /** Button opening the recovery code input. */
  enterRecoveryCodeButton: string;
  /** Title of the window showing the recovery code. */
  recoveryCodeTitle: string;
  /** Advice under the recovery code (when it is useful, keep it secret). */
  recoveryCodeHint: string;
  /** Title of the recovery code input. */
  recoveryCodeInputTitle: string;
  /** Explanation under the input (which code to type, where to find it). */
  recoveryCodeInputHint: string;
  /** Placeholder of the input. */
  recoveryCodePlaceholder: string;
  /** Alert once a recovery code was accepted. */
  recoveryCodeAdded: string;

  /** Shown when the app's `describeBackup` isn't given. */
  defaultDescription: string;
  /** Shown instead of a date when there was no backup yet. */
  never: string;
  /** Cancel button of every dialog. */
  cancel: string;
  /** Default confirm button of the dialogs. */
  confirm: string;
  /** Close button of the windows. */
  close: string;
  /** Title of every error alert. */
  errorTitle: string;
  /**
   * Technical cause under an error message ("HTTP 403 · storageQuotaExceeded").
   */
  errorDetail: (detail: string) => string;
  /**
   * Message of each error code of `@forthtilliath/expo-backup`, written for the
   * user: what happened and what to do.
   */
  errors: Record<BackupErrorCode, string>;
}

/** What `labels` accepts: any subset of the texts, error messages included. */
export type BackupScreenLabelOverrides = Partial<
  Omit<BackupScreenLabels, "errors">
> & {
  errors?: Partial<BackupScreenLabels["errors"]>;
};

/** Built-in texts, per locale. */
export const defaultLabels: Record<BackupLocale, BackupScreenLabels> = {
  fr: frLabels,
  en: enLabels,
};

/**
 * Builds the texts of the screen: the locale's built-in labels, overridden by
 * `overrides` (error messages merged one by one).
 * @param locale - Language of the built-in labels.
 * @param overrides - Texts to replace, if any.
 * @returns The complete labels.
 */
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
