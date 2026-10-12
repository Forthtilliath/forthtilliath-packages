import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

export interface SwipeableRowStyles {
  /** The swipeable's outer container (clips the row while it slides). */
  container?: StyleProp<ViewStyle>;
  deleteAction?: StyleProp<ViewStyle>;
  deleteActionText?: StyleProp<TextStyle>;
  /** Ignored with `fullSwipeToDelete`, which shows no icon. */
  deleteIconColor?: string;
}

export interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => void;
  /** Accessibility label of the delete button, e.g. `"Delete « Marie »"`. */
  deleteLabel: string;
  /** Text of the delete action. Defaults to "Supprimer" (`"Delete"` with `locale="en"`). */
  deleteText?: string;
  /**
   * Swiping past half the row's width and letting go deletes right away —
   * the row slides out, no button to tap. A full-width delete band shows
   * under the row while swiping. Pair it with an `UndoToast`, as nothing
   * asks for confirmation.
   *
   * By default (`false`), the swipe reveals a trash button to tap.
   */
  fullSwipeToDelete?: boolean;
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

const defaultStyles = {
  container: {} satisfies ViewStyle,
  deleteAction: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 84,
    marginBottom: 10,
    borderRadius: 12,
    gap: 2,
  } satisfies ViewStyle,
  deleteActionText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  } satisfies TextStyle,
};

const fullSwipeDefaultStyles = {
  container: {} satisfies ViewStyle,
  // Full width: the swipeable opens by the action's width, so the row slides
  // all the way out, and its default threshold (half that width) is half the row.
  deleteAction: {
    flex: 1,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingEnd: 16,
  } satisfies ViewStyle,
  deleteActionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  } satisfies TextStyle,
};

const DEFAULT_ICON_COLOR = "#ffffff";

/**
 * Swipe a list row left to delete it: either reveal a delete button, on top
 * of a tap to edit the row, or — with `fullSwipeToDelete` — delete as soon
 * as the swipe passes half the row. Built on react-native-gesture-handler's
 * `ReanimatedSwipeable`, so the gesture runs on the UI thread and the app
 * needs `react-native-reanimated` (a peer dependency).
 */
export function SwipeableRow({
  children,
  onDelete,
  deleteLabel,
  deleteText,
  fullSwipeToDelete = false,
  locale,
  styles,
}: SwipeableRowProps) {
  const resolvedLocale = useKitLocale(locale);
  const merged = mergeSlotStyles(
    fullSwipeToDelete ? fullSwipeDefaultStyles : defaultStyles,
    styles,
  );

  return (
    <ReanimatedSwipeable
      containerStyle={merged.container}
      overshootRight={!fullSwipeToDelete}
      onSwipeableOpen={fullSwipeToDelete ? onDelete : undefined}
      renderRightActions={(_progress, _translation, swipeable) => (
        <Pressable
          style={merged.deleteAction}
          onPress={() => {
            if (fullSwipeToDelete) {
              // Slide the row out like a swipe would; onSwipeableOpen deletes.
              swipeable.openRight();
            } else {
              swipeable.close();
              onDelete();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
        >
          {!fullSwipeToDelete && (
            <Ionicons
              name="trash-outline"
              size={22}
              color={styles?.deleteIconColor ?? DEFAULT_ICON_COLOR}
            />
          )}
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
