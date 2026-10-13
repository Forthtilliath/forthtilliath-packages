# @forthtilliath/expo-backup

## 0.1.0

### Minor Changes

- a95b8ef: New package: automatic Google Drive backup (app folder only), manual file export/import with undo, and optional or required encryption with an app-generated key escrowed in the app's Drive folder.
- be03e91: New `backupReminder` module: `shouldShowBackupReminder` (unsaved items too old or too many, "Later" snooze), `snoozeBackupReminder` and `getUnsavedDates`. Pure functions, deep-importable without the native peers.

### Patch Changes

- Updated dependencies [a95b8ef]
  - @forthtilliath/backup-crypto@0.1.0
