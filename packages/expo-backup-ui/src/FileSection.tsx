import { Alert, Text, View } from "react-native";

import type { PickResult } from "@forthtilliath/expo-backup";

import { ActionButton } from "./ActionButton.js";
import { askConfirmation, errorMessage } from "./dialogs.js";
import type { BackupUi } from "./useBackupUi.js";

/** Export to a file through the share sheet, import one back, undo the last restore. */
export function FileSection<T>({ ui }: { ui: BackupUi<T> }) {
  const { manager, state, t, styles, busy, run } = ui;

  const handleExport = () => run(() => manager.exportToFile());

  const handleImport = () =>
    run(async () => {
      let result: PickResult<T> = await manager.pickBackupFile();
      let promptError: string | undefined;
      // A file from another phone, encrypted with a key this one doesn't
      // have: ask for that phone's recovery code until it fits or the user
      // gives up.
      while (result.status === "missing-key") {
        const code = await ui.askRecoveryCode(promptError);
        if (code === null) return;
        try {
          result = await result.retry(code);
        } catch (error) {
          promptError = errorMessage(error, t);
        }
      }
      if (result.status === "cancelled") return;
      await ui.confirmAndRestore(result.data, "file");
    });

  const handleUndo = () =>
    run(async () => {
      const confirmed = await askConfirmation(
        t,
        t.undoConfirmTitle,
        t.undoConfirmMessage,
        t.confirm,
      );
      if (!confirmed) return;
      await manager.undoLastRestore();
      Alert.alert(t.undoneTitle);
    });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t.fileTitle}</Text>
      <Text style={styles.status}>
        {t.lastBackup(ui.formatDate(state.lastBackupAt))}
      </Text>
      <Text style={styles.hint}>
        {manager.isEncryptionActive() ? t.fileHintEncrypted : t.fileHint}
      </Text>
      <ActionButton
        label={t.exportButton}
        variant="secondary"
        onPress={() => void handleExport()}
        disabled={busy}
        styles={styles}
      />
      <ActionButton
        label={t.importButton}
        variant="secondary"
        onPress={() => void handleImport()}
        disabled={busy}
        styles={styles}
      />
      {state.hasSafetyBackup && (
        <ActionButton
          label={t.undoButton}
          variant="ghost"
          onPress={() => void handleUndo()}
          disabled={busy}
          styles={styles}
        />
      )}
    </View>
  );
}
