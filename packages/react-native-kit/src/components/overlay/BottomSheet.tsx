import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Modal, Pressable, ScrollView, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link BottomSheet}, each merged after its default. */
export interface BottomSheetStyles {
  /** The dimmed full-screen backdrop; tapping it closes the sheet. */
  overlay?: StyleProp<ViewStyle>;
  /** The sheet itself: background, rounded top corners, `maxHeight`. */
  sheet?: StyleProp<ViewStyle>;
  /** The `ScrollView` holding the children. */
  scroll?: StyleProp<ViewStyle>;
}

export interface BottomSheetProps {
  visible: boolean;
  /** Called on a backdrop tap and on Android's back button. */
  onClose: () => void;
  children: ReactNode;
  /**
   * Extra space below the content, typically the bottom safe-area inset
   * (`useSafeAreaInsets().bottom`): with Android edge-to-edge, the modal
   * otherwise slides under the system navigation bar.
   *
   * @defaultValue 0
   */
  bottomInset?: number;
  /** Per-slot style overrides — see {@link BottomSheetStyles}. */
  styles?: BottomSheetStyles;
}

const defaultStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  } satisfies ViewStyle,
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 24,
    maxHeight: "85%",
  } satisfies ViewStyle,
  // Without flexShrink the ScrollView takes its content's height, ignores the
  // sheet's maxHeight, and the overflow is clipped instead of scrollable.
  scroll: { flexShrink: 1 } satisfies ViewStyle,
};

const backdropFill = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} satisfies ViewStyle;

/**
 * A modal panel sliding up from the bottom of the screen, its content
 * scrollable past `maxHeight` — instead of inline content that shifts the
 * layout. Tapping the backdrop or pressing back closes it.
 *
 * @example
 * ```tsx
 * import { BottomSheet } from "@forthtilliath/react-native-kit/components/overlay/BottomSheet";
 *
 * const { bottom } = useSafeAreaInsets();
 *
 * <BottomSheet visible={open} onClose={() => setOpen(false)} bottomInset={bottom}>
 *   <DayDetails day={day} />
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onClose,
  children,
  bottomInset = 0,
  styles,
}: BottomSheetProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={merged.overlay}>
        {/* A sibling of the sheet, not its parent: a Pressable wrapping the
            ScrollView would steal its scroll gesture (on Android especially). */}
        <Pressable style={backdropFill} onPress={onClose} />
        <View style={merged.sheet}>
          <ScrollView style={merged.scroll}>{children}</ScrollView>
          {bottomInset > 0 && <View style={{ height: bottomInset }} />}
        </View>
      </View>
    </Modal>
  );
}
