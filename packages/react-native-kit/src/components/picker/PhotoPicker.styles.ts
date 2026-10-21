import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import type { KitLocale } from "../../i18n/locale.js";

export interface PhotoPickerStyles {
  photoPicker?: StyleProp<ViewStyle>;
  photoPreview?: StyleProp<ImageStyle>;
  photoPlaceholder?: StyleProp<ViewStyle>;
  photoPlaceholderText?: StyleProp<TextStyle>;
  clearLink?: StyleProp<TextStyle>;
  iconColor?: string;
}

export interface PhotoPickerLabels {
  photoTitle?: (photoLabel: string) => string;
  editAccessibilityLabel?: (photoLabel: string) => string;
  addAccessibilityLabel?: (photoLabel: string) => string;
  addPlaceholderText?: string;
  cameraPermissionTitle?: string;
  cameraPermissionMessage?: string;
  /**
   * @deprecated Unused: choosing from the library needs no permission (the
   * system photo picker), so no "access denied" alert is ever shown.
   */
  libraryPermissionTitle?: string;
  /** @deprecated Unused — see `libraryPermissionTitle`. */
  libraryPermissionMessage?: string;
  takePhoto?: string;
  chooseFromLibrary?: string;
  cancel?: string;
  removePhoto?: string;
  /** Alert shown when the photo could not be taken or saved (no `onError`). */
  saveErrorTitle?: string;
  saveErrorMessage?: string;
}

export const defaultStyles: Required<PhotoPickerStyles> = {
  photoPicker: { alignSelf: "center", marginTop: 8 },
  photoPreview: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
  },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  photoPlaceholderText: { fontSize: 12, color: "#6b7280" },
  clearLink: {
    color: "#2563eb",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  iconColor: "#6b7280",
};

export const defaultLabels = {
  fr: {
    photoTitle: (photoLabel: string) => `Photo ${photoLabel}`,
    editAccessibilityLabel: (photoLabel: string) =>
      `Photo ${photoLabel}. Modifier.`,
    addAccessibilityLabel: (photoLabel: string) =>
      `Ajouter une photo ${photoLabel}`,
    addPlaceholderText: "Ajouter une photo",
    cameraPermissionTitle: "Accès à l'appareil photo refusé",
    cameraPermissionMessage:
      "Autorise l'accès dans les réglages du téléphone pour prendre une photo.",
    takePhoto: "Prendre une photo",
    chooseFromLibrary: "Choisir dans la galerie",
    cancel: "Annuler",
    removePhoto: "Retirer la photo",
    saveErrorTitle: "Photo non enregistrée",
    saveErrorMessage: "La photo n'a pas pu être enregistrée. Réessaie.",
  },
  en: {
    photoTitle: (photoLabel: string) => `Photo ${photoLabel}`,
    editAccessibilityLabel: (photoLabel: string) =>
      `Photo ${photoLabel}. Edit.`,
    addAccessibilityLabel: (photoLabel: string) => `Add a photo ${photoLabel}`,
    addPlaceholderText: "Add a photo",
    cameraPermissionTitle: "Camera access denied",
    cameraPermissionMessage:
      "Allow access in the phone's settings to take a photo.",
    takePhoto: "Take a photo",
    chooseFromLibrary: "Choose from library",
    cancel: "Cancel",
    removePhoto: "Remove photo",
    saveErrorTitle: "Photo not saved",
    saveErrorMessage: "The photo could not be saved. Try again.",
  },
} satisfies Record<
  KitLocale,
  Required<
    Omit<
      PhotoPickerLabels,
      "libraryPermissionTitle" | "libraryPermissionMessage"
    >
  >
>;
