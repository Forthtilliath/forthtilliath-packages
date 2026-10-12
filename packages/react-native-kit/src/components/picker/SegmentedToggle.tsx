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
  /** Every option's `hint` line. */
  hint?: StyleProp<TextStyle>;
  /** Added on top of `hint` for the active one. */
  hintActive?: StyleProp<TextStyle>;
}

export interface SegmentedToggleOption<T extends string> {
  value: T;
  label: string;
  /** A smaller line under the label (e.g. "2 × 2 joueurs"). */
  hint?: string;
}

export interface SegmentedToggleProps<T extends string> {
  options: readonly SegmentedToggleOption<T>[];
  /** The active option's value. */
  value: T;
  onChange: (value: T) => void;
  /** What the choice is about, read by screen readers on the group. */
  label?: string;
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
  hint: { fontSize: 12, marginTop: 2, color: "#6b7280" } satisfies TextStyle,
  hintActive: { color: "#dbeafe" } satisfies TextStyle,
};

/**
 * A row of equal-width buttons of which exactly one is active — a view
 * switch such as Calendar / List. Announced as a radio group.
 *
 * @example
 * ```tsx
 * import { SegmentedToggle } from "@forthtilliath/react-native-kit/components/picker/SegmentedToggle";
 *
 * <SegmentedToggle
 *   label="Affichage"
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
  label,
  styles,
}: SegmentedToggleProps<T>) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View
      style={merged.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[merged.button, active && merged.buttonActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active, checked: active }}
            accessibilityLabel={
              option.hint ? `${option.label}, ${option.hint}` : option.label
            }
            onPress={() => {
              onChange(option.value);
            }}
          >
            <Text style={[merged.text, active && merged.textActive]}>
              {option.label}
            </Text>
            {option.hint !== undefined && (
              <Text style={[merged.hint, active && merged.hintActive]}>
                {option.hint}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
