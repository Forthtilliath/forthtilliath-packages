# @forthtilliath/expo-backup

## 0.4.0

### Minor Changes

- 020a906: expo-backup: an automatic upload of empty data (`isEmpty`) no longer replaces a Google Drive backup that still holds data (or can't be read): it is refused with `cloud-erase-blocked`, and every upload stays refused until the user restores the cloud backup or calls the new `confirmCloudErase()`. expo-backup-ui explains the block and adds a "Replace the Drive backup" button, behind a confirmation.

## 0.3.0

### Minor Changes

- 32b73a4: - `expo-backup`: Drive refusals get their own codes (`drive-storage-full`, `drive-rate-limited`, `drive-blocked-by-admin`); a 401 that survives the token refresh is now `reconnect-required` instead of `drive-access-denied`. The state keeps `cloudErrorDetail` (`HTTP 403 · storageQuotaExceeded`, see the new `backupErrorDetail`) and `cloudFailingSince`. New `getCloudBackupProblem` (pure, deep-importable) to warn about a failing automatic backup outside the backup screen. Uploads use a resumable session: backups are no longer capped at 5 MB.
  - `expo-backup-ui`: every error message says what to do; the screen shows since when uploads fail and the technical cause; linking an account whose first upload fails says so instead of "enabled"; "Back up now" confirms or explains. New `useCloudBackupProblem` hook and `codeMessage` helper.

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
