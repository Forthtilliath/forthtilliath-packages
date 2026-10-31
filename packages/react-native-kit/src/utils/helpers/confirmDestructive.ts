import { Alert } from "react-native";

import { DEFAULT_KIT_LOCALE, type KitLocale } from "../../i18n/locale.js";

/** Options of {@link confirmDestructive}. */
export interface ConfirmDestructiveOptions {
  /**
   * Message of the alert. Default: "Cette action est définitive." / "This can't
   * be undone.".
   */
  message?: string;
  /** Cancel button. Default: "Annuler" / "Cancel". */
  cancelLabel?: string;
  /** Confirm button, styled as destructive. Default: "Supprimer" / "Delete". */
  confirmLabel?: string;
  /**
   * Language of the default message/labels. Not a component, so this can't
   * read a `KitLocaleProvider`: pass the app's locale here (French by default).
   */
  locale?: KitLocale;
}

const defaultTexts: Record<
  KitLocale,
  Required<Omit<ConfirmDestructiveOptions, "locale">>
> = {
  fr: {
    message: "Cette action est définitive.",
    cancelLabel: "Annuler",
    confirmLabel: "Supprimer",
  },
  en: {
    message: "This can't be undone.",
    cancelLabel: "Cancel",
    confirmLabel: "Delete",
  },
};

/**
 * Generic destructive confirmation (title + message + Cancel/Confirm), for
 * any irreversible action (deletion, reset...).
 */
export function confirmDestructive(
  title: string,
  onConfirm: () => void,
  options: ConfirmDestructiveOptions = {},
) {
  const { locale = DEFAULT_KIT_LOCALE, ...overrides } = options;
  const { message, cancelLabel, confirmLabel } = {
    ...defaultTexts[locale],
    ...overrides,
  };
  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
