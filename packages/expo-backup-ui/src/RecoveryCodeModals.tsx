import { useState } from "react";
import { Modal, Text, TextInput, View } from "react-native";

import { ActionButton } from "./ActionButton.js";
import type { BackupScreenLabels } from "./labels.js";
import type { MergedStyles } from "./styles.js";

interface ModalProps {
  t: BackupScreenLabels;
  styles: MergedStyles;
}

/** Shows the recovery code, selectable so it can be copied to a password manager. */
export function RecoveryCodeDisplayModal({
  code,
  onClose,
  t,
  styles,
}: ModalProps & { code: string | null; onClose: () => void }) {
  return (
    <Modal
      visible={code !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.sectionTitle}>{t.recoveryCodeTitle}</Text>
          <Text style={styles.recoveryCode} selectable>
            {code}
          </Text>
          <Text style={styles.hint}>{t.recoveryCodeHint}</Text>
          <ActionButton label={t.close} onPress={onClose} styles={styles} />
        </View>
      </View>
    </Modal>
  );
}

/**
 * Asks for a recovery code. Android has no `Alert.prompt`, hence a modal.
 * `error` shows why the previous attempt was refused.
 */
export function RecoveryCodeInputModal({
  visible,
  error,
  onSubmit,
  onCancel,
  t,
  styles,
}: ModalProps & {
  visible: boolean;
  error: string | undefined;
  onSubmit: (code: string) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState("");

  function submit() {
    const typed = code;
    setCode("");
    onSubmit(typed);
  }

  function cancel() {
    setCode("");
    onCancel();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={cancel}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.sectionTitle}>{t.recoveryCodeInputTitle}</Text>
          <Text style={styles.hint}>{t.recoveryCodeInputHint}</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder={t.recoveryCodePlaceholder}
            placeholderTextColor={styles.placeholderTextColor}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            // Keeps the code out of the keyboard's learned words and suggestions.
            importantForAutofill="no"
            secureTextEntry={false}
            keyboardType="visible-password"
          />
          {error !== undefined && <Text style={styles.errorText}>{error}</Text>}
          <ActionButton
            label={t.confirm}
            onPress={submit}
            disabled={code.trim() === ""}
            styles={styles}
          />
          <ActionButton
            label={t.cancel}
            variant="ghost"
            onPress={cancel}
            styles={styles}
          />
        </View>
      </View>
    </Modal>
  );
}
