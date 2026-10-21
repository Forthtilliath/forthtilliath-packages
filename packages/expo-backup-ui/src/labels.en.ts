import type { BackupScreenLabels } from "./labels.js";

export const enLabels: BackupScreenLabels = {
  cloudTitle: "Automatic backup",
  cloudHint:
    "Link your Google account: your data is sent to your Google Drive (in a private folder only this app can see) after every change. Handy to switch phones without losing anything.",
  connectButton: "Connect Google Drive",
  connectedTitle: "Automatic backup enabled",
  connectedConfirm: (email) =>
    `Your data is now sent to the Google Drive of ${email} after every change.`,
  connectedButFailedTitle: "Account linked, but the upload failed",
  lastCloudBackup: (date) => `Last upload: ${date}`,
  cloudPending: " · upload pending…",
  failingSince: (date) => `Uploads have been failing since ${date}.`,
  syncDoneTitle: "Backup uploaded",
  syncDoneMessage: "Your data is up to date on Google Drive.",
  syncFailedTitle: "The backup couldn't be uploaded",
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
  eraseCloudButton: "Replace the Drive backup",
  eraseCloudConfirmTitle: "Erase the Google Drive backup?",
  eraseCloudConfirmMessage:
    "The Google Drive backup will be replaced by this phone's data, which is empty. What it holds will be lost.",
  eraseCloudConfirmButton: "Replace",

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
  errorDetail: (detail) => `Technical detail: ${detail}`,
  errors: {
    "google-unavailable":
      "Google Drive backup isn't available in this version of the app. Use the manual backup (Export my data).",
    "play-services-unavailable":
      "Google Play services aren't available on this phone, so Google Drive backup can't work. Use the manual backup (Export my data).",
    "oauth-misconfigured":
      "Google doesn't recognize this version of the app (missing OAuth client or different SHA-1). Nothing you can do: let the app's developer know.",
    "sign-in-failed":
      "Signing in to Google failed. Check your internet connection, then try again.",
    "reconnect-required":
      "Google no longer lets the app reach your Drive (access removed or expired). Tap “Disconnect”, then reconnect your Google account.",
    "drive-storage-full":
      "Your Google storage is full, so the backup can't be uploaded anymore. Free up some space (Gmail, Drive and Photos share it, see one.google.com/storage), then tap “Back up now”.",
    "drive-rate-limited":
      "Google Drive is receiving too many requests right now. The upload will be retried automatically later.",
    "drive-blocked-by-admin":
      "The administrator of this Google account (work, school…) doesn't let apps use Drive. Disconnect it and link a personal Google account instead.",
    "drive-api-disabled":
      "The Google Drive API isn't enabled in the app's Google Cloud project. Nothing you can do: let the app's developer know.",
    "drive-permission-missing":
      "Access to Google Drive wasn't granted. Tap “Disconnect”, then reconnect your account and tick Drive access.",
    "drive-access-denied":
      "Google Drive refused the upload for an unexpected reason. If it happens again, tap “Disconnect” and reconnect your Google account; otherwise let the app's developer know, with the technical detail.",
    "drive-unavailable":
      "Google Drive is temporarily unavailable. The upload will be retried automatically.",
    network:
      "No internet connection. The upload will be retried automatically once you're online.",
    "cloud-erase-blocked":
      "This phone has no data left, but your Google Drive backup still has some: automatic uploads are paused so as not to erase it. Restore it, or confirm you want to replace it.",
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
    "file-too-large": "This file is too large to be a backup of the app.",
    unknown: "An unexpected error occurred.",
  },
};
