import type { BackupScreenLabels } from "./labels.js";

export const enLabels: BackupScreenLabels = {
  cloudTitle: "Automatic backup",
  cloudHint:
    "Link your Google account: your data is sent to your Google Drive (in a private folder only this app can see) after every change. Handy to switch phones without losing anything.",
  connectButton: "Connect Google Drive",
  connectedTitle: "Automatic backup enabled",
  connectedConfirm: (email) =>
    `Your data is now sent to the Google Drive of ${email} after every change.`,
  lastCloudBackup: (date) => `Last upload: ${date}`,
  cloudPending: " · upload pending…",
  autoHint: "Uploaded automatically after every change.",
  syncNowButton: "Back up now",
  restoreCloudButton: "Restore from Google Drive",
  disconnectButton: "Disconnect",
  disconnectConfirmTitle: "Turn off automatic backup?",
  disconnectConfirmMessage:
    "The last backup stays on your Google Drive, but future changes won't be sent there anymore.",
  conflictTitle: "A backup already exists",
  conflictMessage: (description) =>
    `This Google account already holds a backup (${description}). Which one do you want to keep?`,
  conflictKeepDevice: "This phone",
  conflictKeepCloud: "Google Drive",
  noCloudBackupTitle: "No backup",
  noCloudBackupMessage: "Nothing has been sent to Google Drive yet.",

  fileTitle: "Manual backup",
  lastBackup: (date) => `Last backup: ${date}`,
  fileHint: "A file to keep somewhere safe or move to another phone.",
  fileHintEncrypted:
    "An encrypted file: unreadable without this phone's key, or its recovery code.",
  exportButton: "Export my data",
  importButton: "Import a backup",
  undoButton: "Undo the last restore",
  undoConfirmTitle: "Undo the last restore?",
  undoConfirmMessage:
    "Puts the data back as it was right before the last restore. Anything done since will be lost.",
  undoneTitle: "Data from before the restore is back.",

  restoreConfirmTitle: "Restore this backup?",
  restoreConfirmMessage: (description) =>
    `Backup: ${description}. All current data will be replaced (you can undo the restore afterwards).`,
  restoreConfirmButton: "Restore",
  restoredTitle: "Restore complete",
  restoredMessage: "Your data has been replaced.",

  encryptionTitle: "Encryption",
  encryptionToggle: "Encrypt my backups",
  encryptionOptionalHint:
    "Exported files and the Google Drive copy become unreadable without the app's key. Nothing to remember: the key is kept on this phone and in your Google Drive.",
  encryptionRequiredHint:
    "Your backups are always encrypted. Nothing to remember: the key is kept on this phone and in your Google Drive.",
  showRecoveryCodeButton: "Show recovery code",
  enterRecoveryCodeButton: "Enter a recovery code",
  recoveryCodeTitle: "Recovery code",
  recoveryCodeHint:
    "Only needed without Google Drive: write it down (or keep it in a password manager) to read your exported files on another phone. Never share it.",
  recoveryCodeInputTitle: "Enter a recovery code",
  recoveryCodeInputHint:
    "The recovery code of the phone that created the backup (Settings ▸ Backup ▸ Show recovery code).",
  recoveryCodePlaceholder: "XXXXX-XXXXX-…",
  recoveryCodeAdded: "Recovery code added.",

  defaultDescription: "app data",
  never: "never",
  cancel: "Cancel",
  confirm: "OK",
  close: "Close",
  errorTitle: "Error",
  errors: {
    "google-unavailable":
      "Google Drive backup isn't available in this version of the app.",
    "play-services-unavailable":
      "Google Play services aren't available on this phone.",
    "oauth-misconfigured":
      "Google doesn't recognize this version of the app (missing OAuth client or different SHA-1).",
    "sign-in-failed": "Signing in to Google failed.",
    "reconnect-required": "Reconnect your Google account to resume backups.",
    "drive-api-disabled":
      "The Google Drive API isn't enabled in the app's Google Cloud project.",
    "drive-permission-missing":
      "Access to Google Drive wasn't granted. Reconnect your account and allow Drive access.",
    "drive-access-denied":
      "Google Drive denied access. Reconnect your Google account.",
    "drive-unavailable": "Google Drive is temporarily unavailable.",
    network: "No internet connection.",
    "missing-key":
      "This backup is encrypted with a key this phone doesn't know. Enter the recovery code of the device that created it.",
    "invalid-recovery-code": "This recovery code contains a typo.",
    "recovery-code-mismatch":
      "This recovery code is valid, but it isn't the one that encrypted this file.",
    corrupted: "This backup is damaged or was modified.",
    "newer-format":
      "This backup comes from a newer version of the app. Update the app before importing it.",
    "no-safety-backup": "No restore to undo.",
    "sharing-unavailable": "File sharing isn't available on this device.",
    unknown: "An unexpected error occurred.",
  },
};
