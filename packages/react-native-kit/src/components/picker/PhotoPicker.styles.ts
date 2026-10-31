import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import type { KitLocale } from "../../i18n/locale.js";

/** Style overrides of {@link PhotoPicker}, each merged over its default. */
export interface PhotoPickerStyles {
  /** The pressable around the preview. */
  photoPicker?: StyleProp<ViewStyle>;
  /** The square photo preview. */
  photoPreview?: StyleProp<ImageStyle>;
  /** The dashed "add a photo" box shown without a photo. */
  photoPlaceholder?: StyleProp<ViewStyle>;
  /** Its text. */
  photoPlaceholderText?: StyleProp<TextStyle>;
  /** The "remove the photo" link under the preview. */
  clearLink?: StyleProp<TextStyle>;
  /** Not a style: color of the placeholder's camera icon. */
  iconColor?: string;
}

/** Text overrides of {@link PhotoPicker}, whatever the `locale`. */
export interface PhotoPickerLabels {
  /** Title of the camera / library choice, from `photoLabel`. */
  photoTitle?: (photoLabel: string) => string;
  /**
   * What TalkBack reads on the preview when a photo is set, from `photoLabel`.
   */
  editAccessibilityLabel?: (photoLabel: string) => string;
  /** What TalkBack reads on the placeholder, from `photoLabel`. */
  addAccessibilityLabel?: (photoLabel: string) => string;
  /** Text of the placeholder. Default: "Ajouter une photo" / "Add a photo". */
  addPlaceholderText?: string;
  /** Title of the alert when the camera permission is refused. */
  cameraPermissionTitle?: string;
  /** Message of that alert (how to allow it in the phone's settings). */
  cameraPermissionMessage?: string;
  /**
   * @deprecated Unused: choosing from the library needs no permission (the
   * system photo picker), so no "access denied" alert is ever shown.
   */
  libraryPermissionTitle?: string;
  /** @deprecated Unused — see `libraryPermissionTitle`. */
  libraryPermissionMessage?: string;
  /** Choice opening the camera. */
  takePhoto?: string;
  /** Choice opening the system photo picker. */
  chooseFromLibrary?: string;
  /** Choice closing the menu. */
  cancel?: string;
  /** The link removing the photo. */
  removePhoto?: string;
  /** Alert shown when the photo could not be taken or saved (no `onError`). */
  saveErrorTitle?: string;
  /** Message of the save failure alert. */
  saveErrorMessage?: string;
}

/** Default style of each slot of {@link PhotoPicker}. */
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

/** Built-in texts of {@link PhotoPicker}, per locale. */
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
