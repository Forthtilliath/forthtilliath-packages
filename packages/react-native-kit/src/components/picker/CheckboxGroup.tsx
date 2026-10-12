import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link CheckboxGroup}, each merged after its default. */
export interface CheckboxGroupStyles {
  /** The wrapping row holding the chips. */
  row?: StyleProp<ViewStyle>;
  /** Every chip. */
  chip?: StyleProp<ViewStyle>;
  /** Added on top of `chip` for the checked ones. */
  chipChecked?: StyleProp<ViewStyle>;
  /** Every chip's label. */
  text?: StyleProp<TextStyle>;
  /** Added on top of `text` for the checked ones. */
  textChecked?: StyleProp<TextStyle>;
}

export interface CheckboxGroupOption<T extends string> {
  value: T;
  label: string;
}

export interface CheckboxGroupProps<T extends string> {
  options: readonly CheckboxGroupOption<T>[];
  /** The checked values, in the order they were checked. */
  values: readonly T[];
  /** Receives the new list: a tap adds the option at the end, or removes it. */
  onChange: (values: T[]) => void;
  /** What the choice is about, read by screen readers on the group. */
  label?: string;
  /** Per-slot style overrides — see {@link CheckboxGroupStyles}. */
  styles?: CheckboxGroupStyles;
}

const defaultStyles = {
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 } satisfies ViewStyle,
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#d4d4d4",
  } satisfies ViewStyle,
  chipChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  } satisfies ViewStyle,
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  } satisfies TextStyle,
  textChecked: { color: "#ffffff" } satisfies TextStyle,
};

/**
 * Chips that each check and uncheck independently (extensions, tags, days…),
 * wrapping onto as many lines as needed. Each chip is announced as a checkbox.
 *
 * @example
 * ```tsx
 * import { CheckboxGroup } from "@forthtilliath/react-native-kit/components/picker/CheckboxGroup";
 *
 * <CheckboxGroup
 *   label="Extensions"
 *   options={[{ value: "leaders", label: "Leaders" }, { value: "cities", label: "Cités" }]}
 *   values={extensions}
 *   onChange={setExtensions}
 * />
 * ```
 */
export function CheckboxGroup<T extends string>({
  options,
  values,
  onChange,
  label,
  styles,
}: CheckboxGroupProps<T>) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.row} accessibilityLabel={label}>
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <Pressable
            key={option.value}
            style={[merged.chip, checked && merged.chipChecked]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            accessibilityLabel={option.label}
            onPress={() => {
              onChange(
                checked
                  ? values.filter((v) => v !== option.value)
                  : [...values, option.value],
              );
            }}
          >
            <Text style={[merged.text, checked && merged.textChecked]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
