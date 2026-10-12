import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

import { ActionButton } from "./ActionButton.js";
import { RecoveryCodeDisplayModal } from "./RecoveryCodeModals.js";
import type { BackupUi } from "./useBackupUi.js";

/**
 * Encryption status (toggle in `optional` mode), plus the recovery code: shown
 * only on demand, since it is the key itself.
 */
export function EncryptionSection<T>({ ui }: { ui: BackupUi<T> }) {
  const { manager, state, t, styles, busy, run } = ui;
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  if (manager.encryptionMode === "off") return null;
  const active = manager.isEncryptionActive();

  const handleToggle = (enabled: boolean) =>
    run(() => manager.setEncryptionEnabled(enabled));

  const handleShowCode = () =>
    run(async () => {
      setRecoveryCode(await manager.getRecoveryCode());
    });

  const handleEnterCode = () =>
    run(async () => {
      const code = await ui.askRecoveryCode();
      if (code === null) return;
      await manager.addRecoveryCode(code);
      Alert.alert(t.recoveryCodeAdded);
    });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t.encryptionTitle}</Text>
      {manager.encryptionMode === "optional" ? (
        <Pressable
          style={styles.switchRow}
          disabled={busy}
          onPress={() => void handleToggle(!state.encryptionEnabled)}
          accessibilityRole="switch"
          accessibilityState={{ checked: state.encryptionEnabled }}
          accessibilityLabel={t.encryptionToggle}
        >
          <Text style={styles.switchLabel}>{t.encryptionToggle}</Text>
          <Switch
            value={state.encryptionEnabled}
            disabled={busy}
            onValueChange={(value) => void handleToggle(value)}
          />
        </Pressable>
      ) : null}
      <Text style={styles.hint}>
        {manager.encryptionMode === "required"
          ? t.encryptionRequiredHint
          : t.encryptionOptionalHint}
      </Text>
      {active && (
        <ActionButton
          label={t.showRecoveryCodeButton}
          variant="secondary"
          onPress={() => void handleShowCode()}
          disabled={busy}
          styles={styles}
        />
      )}
      <ActionButton
        label={t.enterRecoveryCodeButton}
        variant="ghost"
        onPress={() => void handleEnterCode()}
        disabled={busy}
        styles={styles}
      />
      <RecoveryCodeDisplayModal
        code={recoveryCode}
        onClose={() => {
          setRecoveryCode(null);
        }}
        t={t}
        styles={styles}
      />
    </View>
  );
}
