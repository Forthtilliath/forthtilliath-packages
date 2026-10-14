---
"@forthtilliath/expo-backup": minor
"@forthtilliath/expo-backup-ui": minor
"@forthtilliath/ts-kit": minor
---

- `expo-backup`: `pickBackupFile` rejects files over `maxFileBytes` (default 10 MB) with the new `file-too-large` code, before reading them, and the picker also offers `.json` files labelled `text/plain` or `application/octet-stream`. New `hasLocalData` option: when it returns false, `restore` skips the undo snapshot instead of calling `collect` on an empty app (first launch, new phone).
- `expo-backup-ui`: French and English messages for `file-too-large`.
- `ts-kit`: `parseChangelogNotes` recognizes every heading level (`#` to `######`), not only `###`.
