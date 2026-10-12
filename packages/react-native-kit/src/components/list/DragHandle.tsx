import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text } from "react-native";
// Gesture-handler's Pressable, not react-native's: the same gesture system as
// the pan handler of react-native-draggable-flatlist. With RN's Pressable the
// two fight over the responder and a drag sometimes starts "empty".
import { Pressable } from "react-native-gesture-handler";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link DragHandle}, each merged after its default. */
export interface DragHandleStyles {
  /** The touch target around the glyph. */
  handle?: StyleProp<ViewStyle>;
  /** The "⠿" glyph. */
  text?: StyleProp<TextStyle>;
}

export interface DragHandleProps {
  /** Start the drag here — typically `drag` from a `DraggableFlatList` row. */
  onPressIn: () => void;
  disabled?: boolean;
  /** E.g. `"Déplacer « Marie »"`. */
  accessibilityLabel: string;
  /** Per-slot style overrides — see {@link DragHandleStyles}. */
  styles?: DragHandleStyles;
}

const defaultStyles = {
  handle: { paddingHorizontal: 4, paddingVertical: 4 } satisfies ViewStyle,
  text: { fontSize: 20, opacity: 0.5, color: "#111111" } satisfies TextStyle,
};

/**
 * The "⠿" grip that reorders a row of a `react-native-draggable-flatlist`
 * list: pressing it starts the drag, the rest of the row stays tappable.
 *
 * @example
 * ```tsx
 * import { DragHandle } from "@forthtilliath/react-native-kit/components/list/DragHandle";
 *
 * renderItem={({ item, drag, isActive }) => (
 *   <Row>
 *     <DragHandle onPressIn={drag} disabled={isActive} accessibilityLabel={`Déplacer ${item.name}`} />
 *     <Text>{item.name}</Text>
 *   </Row>
 * )}
 * ```
 */
export function DragHandle({
  onPressIn,
  disabled,
  accessibilityLabel,
  styles,
}: DragHandleProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <Pressable
      onPressIn={onPressIn}
      disabled={disabled}
      hitSlop={10}
      style={merged.handle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={merged.text}>⠿</Text>
    </Pressable>
  );
}
