import { Alert, Text, View } from "react-native";

import { ActionButton } from "./ActionButton.js";
import { askConfirmation, askConflictChoice, codeMessage } from "./dialogs.js";
import type { BackupUi } from "./useBackupUi.js";

/** Linking a Google account, then the automatic backup's status and actions. */
export function CloudSection<T>({ ui }: { ui: BackupUi<T> }) {
  const { manager, state, t, styles, busy, run } = ui;
  const { cloudAccount } = state;

  /** The failure of the upload that just ran (kept in the state, never thrown), if any. */
  function lastUploadError(): string | null {
    const { cloudError, cloudErrorDetail } = manager.getState();
    return cloudError ? codeMessage(t, cloudError, cloudErrorDetail) : null;
  }

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
      // Linking succeeds even when its first upload fails (Drive full…):
      // saying "enabled" then would hide the problem.
      const uploadError = lastUploadError();
      if (uploadError) Alert.alert(t.connectedButFailedTitle, uploadError);
      else Alert.alert(t.connectedTitle, t.connectedConfirm(result.email));
    });

  const handleSyncNow = () =>
    run(async () => {
      if (await manager.syncNow()) {
        Alert.alert(t.syncDoneTitle, t.syncDoneMessage);
        return;
      }
      // False also when an upload was already running: it reports itself.
      const uploadError = lastUploadError();
      if (uploadError) Alert.alert(t.syncFailedTitle, uploadError);
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

  const handleConfirmErase = () =>
    run(async () => {
      const confirmed = await askConfirmation(
        t,
        t.eraseCloudConfirmTitle,
        t.eraseCloudConfirmMessage,
        t.eraseCloudConfirmButton,
      );
      if (!confirmed) return;
      if (await manager.confirmCloudErase()) {
        Alert.alert(t.syncDoneTitle, t.syncDoneMessage);
        return;
      }
      const uploadError = lastUploadError();
      if (uploadError) Alert.alert(t.syncFailedTitle, uploadError);
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
        <>
          <Text style={styles.errorText}>
            {codeMessage(t, state.cloudError)}
          </Text>
          {state.cloudFailingSince !== null && (
            <Text style={styles.hint}>
              {t.failingSince(ui.formatDate(state.cloudFailingSince))}
            </Text>
          )}
          {state.cloudErrorDetail && (
            <Text style={styles.hint} selectable>
              {t.errorDetail(state.cloudErrorDetail)}
            </Text>
          )}
        </>
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
      {state.cloudError === "cloud-erase-blocked" && (
        <ActionButton
          label={t.eraseCloudButton}
          variant="ghost"
          onPress={() => void handleConfirmErase()}
          disabled={busy}
          styles={styles}
        />
      )}
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
