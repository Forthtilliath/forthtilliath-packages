# @forthtilliath/expo-backup-ui

## 0.2.0

### Minor Changes

- 0e61dea: - `expo-backup`: `pickBackupFile` rejects files over `maxFileBytes` (default 10 MB) with the new `file-too-large` code, before reading them, and the picker also offers `.json` files labelled `text/plain` or `application/octet-stream`. New `hasLocalData` option: when it returns false, `restore` skips the undo snapshot instead of calling `collect` on an empty app (first launch, new phone).
  - `expo-backup-ui`: French and English messages for `file-too-large`.
  - `ts-kit`: `parseChangelogNotes` recognizes every heading level (`#` to `######`), not only `###`.

### Patch Changes

- Updated dependencies [0e61dea]
  - @forthtilliath/expo-backup@0.2.0

## 0.1.0

### Minor Changes

- a95b8ef: New package: shared backup settings screen (Google Drive, manual export/import, encryption and recovery code) for expo-backup.

### Patch Changes

- Updated dependencies [a95b8ef]
- Updated dependencies [be03e91]
  - @forthtilliath/expo-backup@0.1.0
