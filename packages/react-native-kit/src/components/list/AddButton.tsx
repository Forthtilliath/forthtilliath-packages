import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link AddButton}, each merged after its default. */
export interface AddButtonStyles {
  /** The dashed, full-width button. */
  button?: StyleProp<ViewStyle>;
  /** Its label. */
  text?: StyleProp<TextStyle>;
}

export interface AddButtonProps {
  /** Usually starts with "+", e.g. "+ Ajouter un groupe". */
  label: string;
  onPress: () => void;
  /** Per-slot style overrides — see {@link AddButtonStyles}. */
  styles?: AddButtonStyles;
}

const defaultStyles = {
  button: {
    marginTop: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d4d4d4",
    alignItems: "center",
  } satisfies ViewStyle,
  text: { fontWeight: "600", color: "#111111" } satisfies TextStyle,
};

/**
 * The dashed "+ Add …" button closing a list, to append a row to it.
 *
 * @example
 * ```tsx
 * import { AddButton } from "@forthtilliath/react-native-kit/components/list/AddButton";
 *
 * <AddButton label="+ Ajouter un groupe" onPress={addGroup} />
 * ```
 */
export function AddButton({ label, onPress, styles }: AddButtonProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <Pressable
      style={merged.button}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={merged.text}>{label}</Text>
    </Pressable>
  );
}
