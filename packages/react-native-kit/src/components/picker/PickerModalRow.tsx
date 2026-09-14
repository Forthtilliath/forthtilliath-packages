import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PickerItem } from "./PickerModal.js";

export interface PickerModalRowStyles {
  row: StyleProp<ViewStyle>;
  rowThumbnail: StyleProp<ImageStyle>;
  rowThumbnailPlaceholder: StyleProp<ViewStyle>;
  rowThumbnailPlaceholderIconColor: string;
  rowLabel: StyleProp<TextStyle>;
  rowSubtitle: StyleProp<TextStyle>;
}

export interface PickerModalRowProps {
  item: PickerItem;
  styles: PickerModalRowStyles;
  onSelect: (item: PickerItem) => void;
}

// One result row: thumbnail (photo, placeholder icon, or nothing depending
// on `imageUri`), label, and optional subtitle. Extracted from PickerModal's
// `renderItem` to keep that file under the project's 300-line-per-file rule.
export function PickerModalRow({
  item,
  styles,
  onSelect,
}: PickerModalRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={() => {
        onSelect(item);
      }}
      accessibilityRole="button"
      accessibilityLabel={
        item.subtitle ? `${item.label}, ${item.subtitle}` : item.label
      }
    >
      {item.imageUri ? (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.rowThumbnail}
          accessibilityIgnoresInvertColors
        />
      ) : item.imageUri === null ? (
        <View style={styles.rowThumbnailPlaceholder}>
          <Ionicons
            name="cube-outline"
            size={18}
            color={styles.rowThumbnailPlaceholderIconColor}
          />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        {item.subtitle ? (
          <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
