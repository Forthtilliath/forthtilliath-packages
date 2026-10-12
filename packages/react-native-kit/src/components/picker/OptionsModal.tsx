import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** One choice of an {@link OptionsModal} or a `SelectField`. */
export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

/** Per-slot style overrides for {@link OptionsModal}, each merged after its default. */
export interface OptionsModalStyles {
  /** The dimmed full-screen backdrop centering the card; tapping it closes. */
  overlay?: StyleProp<ViewStyle>;
  /** The card holding the scrollable list. */
  card?: StyleProp<ViewStyle>;
  /** Each option row. */
  option?: StyleProp<ViewStyle>;
  /** Each option's label. */
  optionText?: StyleProp<TextStyle>;
}

export interface OptionsModalProps<T extends string | number> {
  visible: boolean;
  /** Called on a backdrop tap, on Android's back button, and after a choice. */
  onClose: () => void;
  options: readonly SelectOption<T>[];
  onSelect: (value: T) => void;
  /** Per-slot style overrides — see {@link OptionsModalStyles}. */
  styles?: OptionsModalStyles;
}

const defaultStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  } satisfies ViewStyle,
  card: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 8,
  } satisfies ViewStyle,
  option: { paddingVertical: 14, paddingHorizontal: 20 } satisfies ViewStyle,
  optionText: { fontSize: 16, color: "#111111" } satisfies TextStyle,
};

/**
 * A centered popup listing options in a scrollable card: tapping one selects
 * it and closes the popup. The building block of `SelectField`, usable on
 * its own behind any custom trigger.
 *
 * @example
 * ```tsx
 * import { OptionsModal } from "@forthtilliath/react-native-kit/components/picker/OptionsModal";
 *
 * <OptionsModal
 *   visible={open}
 *   onClose={() => setOpen(false)}
 *   options={[{ value: "a", label: "Option A" }, { value: "b", label: "Option B" }]}
 *   onSelect={setChoice}
 * />
 * ```
 */
export function OptionsModal<T extends string | number>({
  visible,
  onClose,
  options,
  onSelect,
  styles,
}: OptionsModalProps<T>) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={merged.overlay} onPress={onClose}>
        <View style={merged.card}>
          <ScrollView>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={merged.option}
                accessibilityRole="button"
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text style={merged.optionText}>{option.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
