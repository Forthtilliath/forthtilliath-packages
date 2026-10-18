---
"@forthtilliath/expo-backup": minor
"@forthtilliath/expo-backup-ui": minor
---

- `expo-backup`: Drive refusals get their own codes (`drive-storage-full`, `drive-rate-limited`, `drive-blocked-by-admin`); a 401 that survives the token refresh is now `reconnect-required` instead of `drive-access-denied`. The state keeps `cloudErrorDetail` (`HTTP 403 · storageQuotaExceeded`, see the new `backupErrorDetail`) and `cloudFailingSince`. New `getCloudBackupProblem` (pure, deep-importable) to warn about a failing automatic backup outside the backup screen. Uploads use a resumable session: backups are no longer capped at 5 MB.
- `expo-backup-ui`: every error message says what to do; the screen shows since when uploads fail and the technical cause; linking an account whose first upload fails says so instead of "enabled"; "Back up now" confirms or explains. New `useCloudBackupProblem` hook and `codeMessage` helper.
