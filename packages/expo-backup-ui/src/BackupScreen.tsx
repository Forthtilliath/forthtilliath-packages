import { View } from "react-native";

import type { BackupManager } from "@forthtilliath/expo-backup";

import { CloudSection } from "./CloudSection.js";
import { EncryptionSection } from "./EncryptionSection.js";
import { FileSection } from "./FileSection.js";
import {
  type BackupLocale,
  type BackupScreenLabelOverrides,
  resolveLabels,
} from "./labels.js";
import { RecoveryCodeInputModal } from "./RecoveryCodeModals.js";
import { type BackupScreenStyles, mergeStyles } from "./styles.js";
import { useBackupUi } from "./useBackupUi.js";

const DATE_LOCALES: Record<BackupLocale, string> = { fr: "fr-FR", en: "en-US" };

export interface BackupScreenProps<T> {
  manager: BackupManager<T>;
  /** Hide the Google Drive section (e.g. an app without an OAuth client yet). */
  cloud?: boolean;
  /** Short description of a backup for the confirmations, e.g. "12 aliments, 340 pesées". */
  describeBackup?: (data: T) => string;
  /** Called after a restore (file or cloud), e.g. to refresh in-memory stores. */
  onRestored?: (data: T) => void;
  /** @defaultValue "fr" */
  locale?: BackupLocale;
  /** Locale of the dates. Defaults to the `locale`'s (`fr-FR` / `en-US`). */
  dateLocale?: string;
  /** Overrides individual built-in texts, whatever the `locale`. */
  labels?: BackupScreenLabelOverrides;
  styles?: BackupScreenStyles;
}

/**
 * The whole "Settings ▸ Backup" screen: automatic Google Drive backup, manual
 * file export/import with undo, and — unless the manager's encryption is
 * `off` — the encryption status and recovery code. Render it inside the
 * app's own ScrollView/screen container.
 */
export function BackupScreen<T>({
  manager,
  cloud = true,
  describeBackup,
  onRestored,
  locale = "fr",
  dateLocale,
  labels,
  styles,
}: BackupScreenProps<T>) {
  const merged = mergeStyles(styles);
  const t = resolveLabels(locale, labels);
  const { ui, recoveryPrompt } = useBackupUi({
    manager,
    t,
    styles: merged,
    describeBackup,
    dateLocale: dateLocale ?? DATE_LOCALES[locale],
    onRestored,
  });

  return (
    <View style={merged.container}>
      {cloud && <CloudSection ui={ui} />}
      <FileSection ui={ui} />
      <EncryptionSection ui={ui} />
      <RecoveryCodeInputModal
        visible={recoveryPrompt !== null}
        error={recoveryPrompt?.error}
        onSubmit={(code) => recoveryPrompt?.resolve(code)}
        onCancel={() => recoveryPrompt?.resolve(null)}
        t={t}
        styles={merged}
      />
    </View>
  );
}
