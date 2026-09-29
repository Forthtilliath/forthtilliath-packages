import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";

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
  libraryPermissionTitle?: string;
  libraryPermissionMessage?: string;
  takePhoto?: string;
  chooseFromLibrary?: string;
  cancel?: string;
  removePhoto?: string;
}

export interface PhotoPickerProps {
  photoUri: string | null;
  onChange: (uri: string | null) => void;
  savePhoto: (sourceUri: string) => Promise<string>;
  /** Used as-is in titles/accessibility labels, e.g. "of the container". */
  photoLabel: string;
  labels?: PhotoPickerLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  styles?: PhotoPickerStyles;
}

const defaultStyles: Required<PhotoPickerStyles> = {
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

const defaultLabels = {
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
    libraryPermissionTitle: "Accès aux photos refusé",
    libraryPermissionMessage:
      "Autorise l'accès dans les réglages du téléphone pour choisir une photo.",
    takePhoto: "Prendre une photo",
    chooseFromLibrary: "Choisir dans la galerie",
    cancel: "Annuler",
    removePhoto: "Retirer la photo",
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
    libraryPermissionTitle: "Photo access denied",
    libraryPermissionMessage:
      "Allow access in the phone's settings to choose a photo.",
    takePhoto: "Take a photo",
    chooseFromLibrary: "Choose from library",
    cancel: "Cancel",
    removePhoto: "Remove photo",
  },
} satisfies Record<KitLocale, Required<PhotoPickerLabels>>;

// Photo picker (camera or library) with a preview.
export function PhotoPicker({
  photoUri,
  onChange,
  savePhoto,
  photoLabel,
  labels,
  locale,
  styles,
}: PhotoPickerProps) {
  // Style fields are merged as arrays (default, then override) so a partial
  // override only changes the properties it specifies instead of replacing
  // the whole default style object.
  const mergedStyles = {
    photoPicker: [defaultStyles.photoPicker, styles?.photoPicker],
    photoPreview: [defaultStyles.photoPreview, styles?.photoPreview],
    photoPlaceholder: [
      defaultStyles.photoPlaceholder,
      styles?.photoPlaceholder,
    ],
    photoPlaceholderText: [
      defaultStyles.photoPlaceholderText,
      styles?.photoPlaceholderText,
    ],
    clearLink: [defaultStyles.clearLink, styles?.clearLink],
    iconColor: styles?.iconColor ?? defaultStyles.iconColor,
  };
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.cameraPermissionTitle, t.cameraPermissionMessage);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      onChange(await savePhoto(result.assets[0].uri));
    }
  }

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.libraryPermissionTitle, t.libraryPermissionMessage);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      onChange(await savePhoto(result.assets[0].uri));
    }
  }

  function handlePickPhoto() {
    Alert.alert(t.photoTitle(photoLabel), undefined, [
      {
        text: t.takePhoto,
        onPress: () => {
          void pickFromCamera();
        },
      },
      {
        text: t.chooseFromLibrary,
        onPress: () => {
          void pickFromLibrary();
        },
      },
      { text: t.cancel, style: "cancel" },
    ]);
  }

  return (
    <>
      <Pressable
        style={mergedStyles.photoPicker}
        onPress={handlePickPhoto}
        accessibilityRole="button"
        accessibilityLabel={
          photoUri
            ? t.editAccessibilityLabel(photoLabel)
            : t.addAccessibilityLabel(photoLabel)
        }
      >
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={mergedStyles.photoPreview}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={mergedStyles.photoPlaceholder}>
            <Ionicons
              name="camera-outline"
              size={28}
              color={mergedStyles.iconColor}
            />
            <Text style={mergedStyles.photoPlaceholderText}>
              {t.addPlaceholderText}
            </Text>
          </View>
        )}
      </Pressable>
      {photoUri ? (
        <Pressable
          onPress={() => {
            onChange(null);
          }}
          accessibilityRole="button"
          accessibilityLabel={t.removePhoto}
        >
          <Text style={mergedStyles.clearLink}>{t.removePhoto}</Text>
        </Pressable>
      ) : null}
    </>
  );
}
