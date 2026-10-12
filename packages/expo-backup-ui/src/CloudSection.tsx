import { Alert, Text, View } from "react-native";

import { ActionButton } from "./ActionButton.js";
import { askConfirmation, askConflictChoice } from "./dialogs.js";
import type { BackupUi } from "./useBackupUi.js";

/** Linking a Google account, then the automatic backup's status and actions. */
export function CloudSection<T>({ ui }: { ui: BackupUi<T> }) {
  const { manager, state, t, styles, busy, run } = ui;
  const { cloudAccount } = state;

  const handleConnect = () =>
    run(async () => {
      const result = await manager.connectCloud();
      if (result.status === "cancelled") return;
      if (result.status === "conflict") {
        const keep = await askConflictChoice(t, ui.describe(result.remote));
        if (keep === null) {
          await manager.cancelConflict();
          return;
        }
        await manager.resolveConflict(result, keep);
      }
      Alert.alert(t.connectedTitle, t.connectedConfirm(result.email));
    });

  const handleSyncNow = () =>
    run(async () => {
      await manager.syncNow();
      // Errors are kept in the state (shown below) rather than thrown.
    });

  const handleRestore = () =>
    run(async () => {
      const remote = await manager.fetchCloudBackup();
      if (remote === null) {
        Alert.alert(t.noCloudBackupTitle, t.noCloudBackupMessage);
        return;
      }
      await ui.confirmAndRestore(remote, "cloud");
    });

  const handleDisconnect = () =>
    run(async () => {
      const confirmed = await askConfirmation(
        t,
        t.disconnectConfirmTitle,
        t.disconnectConfirmMessage,
        t.disconnectButton,
      );
      if (confirmed) await manager.disconnectCloud();
    });

  if (!cloudAccount) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.cloudTitle}</Text>
        <Text style={styles.hint}>{t.cloudHint}</Text>
        <ActionButton
          label={t.connectButton}
          onPress={() => void handleConnect()}
          busy={busy}
          styles={styles}
        />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t.cloudTitle}</Text>
      <Text style={styles.status}>{cloudAccount.email}</Text>
      <Text style={styles.status}>
        {t.lastCloudBackup(ui.formatDate(state.lastCloudBackupAt))}
        {state.cloudPending && !state.cloudError ? t.cloudPending : ""}
      </Text>
      {state.cloudError && (
        <Text style={styles.errorText}>{t.errors[state.cloudError]}</Text>
      )}
      <Text style={styles.hint}>{t.autoHint}</Text>
      <ActionButton
        label={t.syncNowButton}
        variant="secondary"
        onPress={() => void handleSyncNow()}
        disabled={busy}
        styles={styles}
      />
      <ActionButton
        label={t.restoreCloudButton}
        variant="secondary"
        onPress={() => void handleRestore()}
        disabled={busy}
        styles={styles}
      />
      <ActionButton
        label={t.disconnectButton}
        variant="ghost"
        onPress={() => void handleDisconnect()}
        disabled={busy}
        styles={styles}
      />
    </View>
  );
}
