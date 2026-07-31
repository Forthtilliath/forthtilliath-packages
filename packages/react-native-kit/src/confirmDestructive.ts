import { Alert } from "react-native";

export interface ConfirmDestructiveOptions {
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

const DEFAULT_MESSAGE = "Cette action est définitive.";
const DEFAULT_CANCEL_LABEL = "Annuler";
const DEFAULT_CONFIRM_LABEL = "Supprimer";

// Confirmation destructive générique (titre + message + Annuler/Confirmer),
// pour toute action irréversible (suppression, réinitialisation...).
export function confirmDestructive(
  title: string,
  onConfirm: () => void,
  options: ConfirmDestructiveOptions = {},
) {
  const {
    message = DEFAULT_MESSAGE,
    cancelLabel = DEFAULT_CANCEL_LABEL,
    confirmLabel = DEFAULT_CONFIRM_LABEL,
  } = options;
  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
