# @forthtilliath/expo-backup-ui

The "Settings ▸ Backup" screen for [`@forthtilliath/expo-backup`](../expo-backup#readme), shared by every app: automatic Google Drive backup, manual export/import with undo, encryption and recovery code. French by default, English with `locale="en"`, every text and style overridable.

When the automatic backup refused to wipe the Drive copy with an empty phone (`cloud-erase-blocked`), the Drive section explains it and offers both ways out: "Restore from Google Drive", or "Replace the Drive backup" (`confirmCloudErase`, after a confirmation).

## Install

```bash
npm install @forthtilliath/expo-backup-ui @forthtilliath/expo-backup
```

No dependency beyond `react` / `react-native` (no icon library, no other kit).

## Usage

```tsx
// app/_layout.tsx — once
import { useAutoBackup } from "@forthtilliath/expo-backup-ui";
import { backup } from "@/lib/backup";

useAutoBackup(backup);
```

```tsx
// app/(tabs)/settings/backup.tsx
import { BackupScreen } from "@forthtilliath/expo-backup-ui";

<ScrollView contentContainerStyle={{ padding: 16 }}>
  <BackupScreen
    manager={backup}
    describeBackup={(data) =>
      `${data.foods.length} aliments, ${data.weighings.length} pesées`
    }
    styles={{
      section: { backgroundColor: colors.surface, borderColor: colors.border },
      sectionTitle: { color: colors.text },
      hint: { color: colors.textMuted },
      button: { backgroundColor: colors.primary },
    }}
  />
</ScrollView>;
```

| Prop                    |                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `manager`               | The app's `createBackupManager(...)`                                                             |
| `cloud`                 | `false` hides the Google Drive section (no OAuth client yet)                                     |
| `describeBackup`        | Short description of a backup in the confirmations                                               |
| `onRestored`            | Called after a restore, e.g. to reload in-memory stores                                          |
| `locale` / `dateLocale` | `"fr"` (default) or `"en"`; dates follow the locale unless `dateLocale` is set                   |
| `labels`                | Any subset of the texts, error messages included (`labels.errors.network`…)                      |
| `styles`                | Per-slot overrides merged on the defaults (`section`, `button`, `secondaryButton`, `modalCard`…) |

Every action runs one at a time (a double tap is ignored) and shows errors in an alert: the package's own in the screen's language, the app's `parse` errors as is.

The encryption section only appears when the manager's encryption isn't `off`: a switch in `optional` mode, a status line in `required` mode, and — on demand only, since it is the key — the recovery code, shown selectable so it can be copied into a password manager.

A failing automatic backup is spelled out on the screen: what went wrong and what to do, since when uploads fail, and the technical cause (selectable, to send to the developer). Linking an account whose first upload fails says so instead of "enabled", and "Back up now" confirms or explains.

Also exported: `useBackupState(manager)` (the manager's state, re-rendering on change), `useCloudBackupProblem(manager)` (a failure to warn about outside the screen, see `getCloudBackupProblem` in expo-backup), `errorMessage(error, labels)` and `codeMessage(labels, code, detail)`.
