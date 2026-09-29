import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

export interface SwipeableRowStyles {
  deleteAction?: StyleProp<ViewStyle>;
  deleteActionText?: StyleProp<TextStyle>;
  deleteIconColor?: string;
}

export interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => void;
  /** Accessibility label of the delete button, e.g. `"Delete « Marie »"`. */
  deleteLabel: string;
  /** Text under the trash icon. Defaults to "Supprimer" (`"Delete"` with `locale="en"`). */
  deleteText?: string;
  /**
   * Language of the default `deleteText` — French by default, or the
   * nearest `KitLocaleProvider`'s.
   */
  locale?: KitLocale;
  styles?: SwipeableRowStyles;
}

const defaultDeleteTexts: Record<KitLocale, string> = {
  fr: "Supprimer",
  en: "Delete",
};

const defaultStyles: Required<SwipeableRowStyles> = {
  deleteAction: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 84,
    marginBottom: 10,
    borderRadius: 12,
    gap: 2,
  },
  deleteActionText: { color: "#ffffff", fontSize: 11, fontWeight: "600" },
  deleteIconColor: "#ffffff",
};

/**
 * Swipe a list row left to reveal a delete button, on top of a tap to edit it.
 * Built on react-native-gesture-handler's `ReanimatedSwipeable`, so the app
 * needs `react-native-reanimated` (a peer dependency).
 */
export function SwipeableRow({
  children,
  onDelete,
  deleteLabel,
  deleteText,
  locale,
  styles,
}: SwipeableRowProps) {
  const resolvedLocale = useKitLocale(locale);
  const merged = {
    ...mergeSlotStyles(defaultStyles, styles),
    deleteIconColor: styles?.deleteIconColor ?? defaultStyles.deleteIconColor,
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={(_progress, _translation, swipeable) => (
        <Pressable
          style={merged.deleteAction}
          onPress={() => {
            swipeable.close();
            onDelete();
          }}
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={merged.deleteIconColor}
          />
          <Text style={merged.deleteActionText}>
            {deleteText ?? defaultDeleteTexts[resolvedLocale]}
          </Text>
        </Pressable>
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}
