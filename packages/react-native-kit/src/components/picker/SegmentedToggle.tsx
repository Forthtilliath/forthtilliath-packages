import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link SegmentedToggle}, each merged after its default. */
export interface SegmentedToggleStyles {
  /** The row holding the buttons. */
  row?: StyleProp<ViewStyle>;
  /** Every button (equal widths through `flex: 1`). */
  button?: StyleProp<ViewStyle>;
  /** Added on top of `button` for the active one. */
  buttonActive?: StyleProp<ViewStyle>;
  /** Every button's label. */
  text?: StyleProp<TextStyle>;
  /** Added on top of `text` for the active one. */
  textActive?: StyleProp<TextStyle>;
}

export interface SegmentedToggleProps<T extends string> {
  options: readonly { value: T; label: string }[];
  /** The active option's value. */
  value: T;
  onChange: (value: T) => void;
  /** Per-slot style overrides — see {@link SegmentedToggleStyles}. */
  styles?: SegmentedToggleStyles;
}

const defaultStyles = {
  row: { flexDirection: "row", gap: 8, marginBottom: 12 } satisfies ViewStyle,
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    alignItems: "center",
  } satisfies ViewStyle,
  buttonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  } satisfies ViewStyle,
  text: { fontWeight: "600", color: "#111111" } satisfies TextStyle,
  textActive: { color: "#ffffff" } satisfies TextStyle,
};

/**
 * A row of equal-width buttons of which exactly one is active — a view
 * switch such as Calendar / List.
 *
 * @example
 * ```tsx
 * import { SegmentedToggle } from "@forthtilliath/react-native-kit/components/picker/SegmentedToggle";
 *
 * <SegmentedToggle
 *   options={[{ value: "calendar", label: "Calendrier" }, { value: "list", label: "Liste" }]}
 *   value={view}
 *   onChange={setView}
 * />
 * ```
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  styles,
}: SegmentedToggleProps<T>) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.row}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[merged.button, active && merged.buttonActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              onChange(option.value);
            }}
          >
            <Text style={[merged.text, active && merged.textActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
