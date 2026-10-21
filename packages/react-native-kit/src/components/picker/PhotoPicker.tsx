import { type ReactNode, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";
import {
  defaultLabels,
  defaultStyles,
  type PhotoPickerLabels,
  type PhotoPickerStyles,
} from "./PhotoPicker.styles.js";

export type {
  PhotoPickerLabels,
  PhotoPickerStyles,
} from "./PhotoPicker.styles.js";

export interface PhotoPickerProps {
  photoUri: string | null;
  onChange: (uri: string | null) => void;
  savePhoto: (sourceUri: string) => Promise<string>;
  /** Used as-is in titles/accessibility labels, e.g. "of the container". */
  photoLabel: string;
  /**
   * Replaces the square preview and the "Add a photo" placeholder, e.g. a
   * round avatar with a small camera badge. `saving` is `true` while
   * `savePhoto` runs (the picker ignores presses meanwhile).
   */
  renderPreview?: (photoUri: string | null, saving: boolean) => ReactNode;
  /**
   * Called when taking, picking or saving the photo fails (`savePhoto`
   * rejected…). Unset, an alert says the photo was not saved
   * (`labels.saveErrorTitle` / `saveErrorMessage`).
   */
  onError?: (error: unknown) => void;
  labels?: PhotoPickerLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  styles?: PhotoPickerStyles;
}

const PICKER_OPTIONS = {
  mediaTypes: "images",
  quality: 0.5,
  allowsEditing: true,
  aspect: [1, 1],
} satisfies ImagePicker.ImagePickerOptions;

// Photo picker (camera or library) with a preview.
export function PhotoPicker({
  photoUri,
  onChange,
  savePhoto,
  photoLabel,
  renderPreview,
  onError,
  labels,
  locale,
  styles,
}: PhotoPickerProps) {
  const mergedStyles = {
    ...mergeSlotStyles(defaultStyles, styles),
    iconColor: styles?.iconColor ?? defaultStyles.iconColor,
  };
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };
  const [saving, setSaving] = useState(false);
  // Ahead of `saving`, which only changes on the next render: a second press
  // in the same frame must not start a second save.
  const busy = useRef(false);

  async function pick(
    launch: () => Promise<ImagePicker.ImagePickerResult | null>,
  ) {
    if (busy.current) return;
    busy.current = true;
    try {
      const result = await launch();
      const asset = result && !result.canceled ? result.assets[0] : undefined;
      if (!asset) return;
      setSaving(true);
      onChange(await savePhoto(asset.uri));
    } catch (error) {
      if (onError) onError(error);
      else Alert.alert(t.saveErrorTitle, t.saveErrorMessage);
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  async function launchCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.cameraPermissionTitle, t.cameraPermissionMessage);
      return null;
    }
    return ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  }

  // No permission request: the library is opened through the system photo
  // picker, which needs none — so apps don't have to keep the storage
  // permissions just for this.
  function launchLibrary() {
    return ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  }

  function handlePickPhoto() {
    if (busy.current) return;
    Alert.alert(t.photoTitle(photoLabel), undefined, [
      {
        text: t.takePhoto,
        onPress: () => {
          void pick(launchCamera);
        },
      },
      {
        text: t.chooseFromLibrary,
        onPress: () => {
          void pick(launchLibrary);
        },
      },
      { text: t.cancel, style: "cancel" },
    ]);
  }

  const defaultPreview = photoUri ? (
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
  );

  return (
    <>
      <Pressable
        style={mergedStyles.photoPicker}
        onPress={handlePickPhoto}
        disabled={saving}
        accessibilityRole="button"
        accessibilityState={{ busy: saving, disabled: saving }}
        accessibilityLabel={
          photoUri
            ? t.editAccessibilityLabel(photoLabel)
            : t.addAccessibilityLabel(photoLabel)
        }
      >
        {renderPreview ? renderPreview(photoUri, saving) : defaultPreview}
      </Pressable>
      {photoUri ? (
        <Pressable
          onPress={() => {
            onChange(null);
          }}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={t.removePhoto}
        >
          <Text style={mergedStyles.clearLink}>{t.removePhoto}</Text>
        </Pressable>
      ) : null}
    </>
  );
}
