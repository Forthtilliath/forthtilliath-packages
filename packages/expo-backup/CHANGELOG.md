# @forthtilliath/expo-backup

## 0.2.0

### Minor Changes

- 0e61dea: - `expo-backup`: `pickBackupFile` rejects files over `maxFileBytes` (default 10 MB) with the new `file-too-large` code, before reading them, and the picker also offers `.json` files labelled `text/plain` or `application/octet-stream`. New `hasLocalData` option: when it returns false, `restore` skips the undo snapshot instead of calling `collect` on an empty app (first launch, new phone).
  - `expo-backup-ui`: French and English messages for `file-too-large`.
  - `ts-kit`: `parseChangelogNotes` recognizes every heading level (`#` to `######`), not only `###`.

## 0.1.0

### Minor Changes

- a95b8ef: New package: automatic Google Drive backup (app folder only), manual file export/import with undo, and optional or required encryption with an app-generated key escrowed in the app's Drive folder.
- be03e91: New `backupReminder` module: `shouldShowBackupReminder` (unsaved items too old or too many, "Later" snooze), `snoozeBackupReminder` and `getUnsavedDates`. Pure functions, deep-importable without the native peers.

### Patch Changes

- Updated dependencies [a95b8ef]
  - @forthtilliath/backup-crypto@0.1.0
