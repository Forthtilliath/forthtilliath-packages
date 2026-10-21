# @forthtilliath/expo-backup

Backups for an Expo Android app, the app only describing its own data:

- **Automatic Google Drive backup** after every change, in the app's private `appDataFolder` (scope `drive.appdata`: the app sees no other file of the user's Drive). Offline-safe: a failed upload stays pending and is retried at the next start or return to the app.
- **Manual backup**: a file handed to the share sheet, read back through the file picker, with an undo of the last restore.
- **Encryption** (`off` / `optional` / `required`) with an **app-generated key** — nothing for the user to remember. See [Security model](#security-model).

The matching settings screen is in [`@forthtilliath/expo-backup-ui`](../expo-backup-ui#readme).

## Install

```bash
npx expo install @forthtilliath/expo-backup expo-file-system expo-secure-store expo-crypto expo-sharing
# Google Drive backup only:
npx expo install @react-native-google-signin/google-signin
```

All are peer dependencies. Google Sign-In is optional and loaded lazily: on a binary built without it, only the Drive backup is unavailable (`google-unavailable`), the app doesn't crash.

## Usage

```ts
// src/lib/backup.ts — created once, at module level
import { createBackupManager } from "@forthtilliath/expo-backup";

export const backup = createBackupManager<ExportedData>({
  appId: "glucodose", // file names + secure-store key: never change it once shipped
  encryption: "required",
  collect: buildExportedData, // snapshot of all the data
  parse: parseBackup, // validate + migrate; throw an Error with a user-facing message
  apply: replaceAllData, // replace everything (no merge)
  isEmpty: (data) => data.foods.length === 0, // optional, recommended: skip the "which one to keep?" question, and never let empty data wipe the cloud backup
  hasLocalData: () => countFoods() > 0, // optional: false = restore skips the undo snapshot (first launch, new phone)
  maxFileBytes: 5 * 1024 * 1024, // optional: largest importable file, checked before reading (default 10 MB)
  exportFileName: (date) => buildExportFileName("sauvegarde", "json", date),
});
```

```tsx
// root layout
useAutoBackup(backup); // from expo-backup-ui, or: useEffect(() => backup.start(), [])

// wherever backed-up data changes (store subscription, live query, after a write…)
backup.notifyDataChanged(); // debounced (3 s), flushed when the app goes to the background
```

`BackupManager` methods: `connectCloud` → `{ cancelled | connected | conflict }`, `resolveConflict(conflict, "device" | "cloud")`, `cancelConflict`, `syncNow`, `confirmCloudErase`, `fetchCloudBackup`, `disconnectCloud`, `exportToFile`, `pickBackupFile` → `{ cancelled | ready | missing-key (+ retry(recoveryCode)) }`, `restore(data, { source })`, `undoLastRestore`, `setEncryptionEnabled`, `getRecoveryCode`, `addRecoveryCode`, plus `getState`/`subscribe` (for `useSyncExternalStore`).

The file picker offers `.json` files whether the phone labels them JSON, plain text or raw bytes; anything over `maxFileBytes` is rejected (`file-too-large`) before `parse` runs.

Errors are `BackupError`s with a `code` (see `BackupErrorCode`), translated by the UI package. The app's own `parse` errors are passed through untouched. Drive's refusals get their own code when Google says why (`drive-storage-full`, `drive-rate-limited`, `drive-blocked-by-admin`…), and `backupErrorDetail(error)` gives the raw cause (`HTTP 403 · storageQuotaExceeded`) to show under the message.

A failed automatic upload never throws: the state keeps `cloudError`, `cloudErrorDetail` and `cloudFailingSince` (first failure since the last success) until the next success. Uploads go through a resumable session, so a backup isn't limited to Drive's 5 MB cap on simple uploads.

The cloud keeps a single copy, overwritten on every upload. So when this device's data is empty (`isEmpty`) while the cloud backup still holds some (or can't be read), the upload is **refused** (`cloud-erase-blocked`) rather than wipe the only other copy 3 s after an "erase everything" or a data loss. Every upload then stays refused — data added since included — until the user decides: restore the cloud backup (`fetchCloudBackup` + `restore`, which lifts the block), or confirm the erase with `confirmCloudErase()`. `expo-backup-ui` offers both. Without `isEmpty`, there is no such check.

### Telling the user the automatic backup fails

The backup screen shows the error, but nobody opens it to check. `getCloudBackupProblem(state)` (pure, deep-importable from `@forthtilliath/expo-backup/cloudBackupProblem`) says when to warn elsewhere — banner, alert, tab badge: at once for what the user must fix (storage full, access removed…), and only after `transientGraceMs` (1 day) for what fixes itself (offline, Drive down). The UI package wraps it in `useCloudBackupProblem(manager)`.

### Backup reminder

Pure functions (no native module) deciding when to nudge the user to back up — deep-import `@forthtilliath/expo-backup/backupReminder` to skip the rest of the package:

```ts
import {
  shouldShowBackupReminder,
  snoozeBackupReminder,
} from "@forthtilliath/expo-backup/backupReminder";

const show = shouldShowBackupReminder({
  itemDates: games.map((g) => g.finishedAt ?? g.createdAt),
  lastBackupAt, // backup.getState().lastBackupAt, or the app's own
  snoozedUntil, // stored by the app
  // afterDays: 7, afterCount: 5
});
// "Later" button:
setSnoozedUntil(snoozeBackupReminder()); // + 7 days
```

It shows once the oldest unsaved item is `afterDays` old, or as soon as `afterCount` items are unsaved. While automatic backups work, `lastBackupAt` follows every change and it never shows; when they fail, it takes over. `getUnsavedDates(itemDates, lastBackupAt)` gives the dates it counts.

## Security model

- The key is **random (256 bits), generated by the app**. It's kept in `expo-secure-store` (Android Keystore), which Expo excludes from Android's automatic backup.
- When Google Drive is linked, the keyring is also **escrowed in the app's private Drive folder**, before any encrypted upload. A new phone signed in to the same account reads the backups with nothing to type.
- The **recovery code** (on demand in the UI) is the key itself, for users without Drive: an encrypted export is unreadable on another phone without it.
- What it protects: an exported file that leaks (e-mail, Downloads, a visible Drive folder). The Drive copy doesn't show in Drive's web UI (`appDataFolder` is only reachable through the app's own OAuth client, i.e. an APK signed with its key).
- What it doesn't: **anyone who gets into the Google account** — they can install the app (a sideloaded APK is often public) on another phone and sign in: the "new phone" restore decrypts everything with the escrowed key. Nor **Google itself**, which stores both the keyring and the backup. Accepted trade-off for "nothing to remember": the Google account's own security (2-step verification) guards the Drive copy. Covering it would take a user passphrase wrapping the escrowed key, at the cost of losing the Drive backup if it's forgotten.
- Plain exports stay importable in `required` mode (they predate encryption). New ones are always encrypted.
- Set `android.allowBackup: false` in `app.json` for apps with sensitive data: otherwise Android's own backup copies the database in clear (unless the phone has a screen lock), defeating the encryption.

## Google Cloud setup (once per app)

1. [Google Cloud console](https://console.cloud.google.com/) → a project (one per app, or shared) → **APIs & Services ▸ Library** → enable **Google Drive API**.
2. **OAuth consent screen**: External, add the scope `.../auth/drive.appdata`, add yourself as a test user (or publish the app).
3. **Credentials ▸ Create OAuth client ID ▸ Android**: the app's package name (`android.package`) and the **SHA-1 of the release signing key** (`keytool -list -v -keystore release.keystore`). One client per signing key: a debug build needs its own.
4. Rebuild the APK (the native module must be in the binary).

`oauth-misconfigured` (DEVELOPER_ERROR) means step 3 doesn't match the APK; `drive-api-disabled` means step 1 was skipped. Declare only `drive.appdata` (non-sensitive) and no logo: a broader Drive scope is restricted, and a logo requires brand verification, both reviews Google asks for once the app is published.
