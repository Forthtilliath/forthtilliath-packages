import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Modal, Pressable, ScrollView, View } from "react-native";

import type { KitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import {
  BottomSheetHeader,
  type BottomSheetHeaderProps,
} from "./BottomSheetHeader.js";

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
  /** A title above the content, which stays visible while the content scrolls. */
  title?: string;
  /** A quieter line under the title. */
  subtitle?: string;
  /** A text button right of the title ("Réinitialiser"). */
  headerAction?: BottomSheetHeaderProps["action"];
  /** Shows a grab bar at the top. @defaultValue false */
  showHandle?: boolean;
  /** Shows a × button calling `onClose`, right of the title. @defaultValue false */
  showCloseButton?: boolean;
  /** Spoken name of the × button. @defaultValue "Fermer" ("Close" in English) */
  closeLabel?: string;
  /** Language of the built-in labels. */
  locale?: KitLocale;
  /** Style overrides of the header — see `BottomSheetHeaderStyles`. */
  headerStyles?: BottomSheetHeaderProps["styles"];
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
 *
 * // With a header that stays put while the content scrolls:
 * <BottomSheet
 *   visible={open}
 *   onClose={close}
 *   bottomInset={bottom}
 *   title="Filtres"
 *   subtitle="12 jeux correspondent"
 *   headerAction={{ label: "Réinitialiser", onPress: resetFilters }}
 *   showHandle
 *   showCloseButton
 * >
 *   <Filters />
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  visible,
  onClose,
  children,
  bottomInset = 0,
  styles,
  title,
  subtitle,
  headerAction,
  showHandle = false,
  showCloseButton = false,
  closeLabel,
  locale,
  headerStyles,
}: BottomSheetProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const hasHeader =
    showHandle ||
    showCloseButton ||
    title !== undefined ||
    subtitle !== undefined ||
    headerAction !== undefined;

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
          {hasHeader && (
            <BottomSheetHeader
              title={title}
              subtitle={subtitle}
              action={headerAction}
              showHandle={showHandle}
              onClose={showCloseButton ? onClose : undefined}
              closeLabel={closeLabel}
              locale={locale}
              styles={headerStyles}
            />
          )}
          <ScrollView style={merged.scroll}>{children}</ScrollView>
          {bottomInset > 0 && <View style={{ height: bottomInset }} />}
        </View>
      </View>
    </Modal>
  );
}
