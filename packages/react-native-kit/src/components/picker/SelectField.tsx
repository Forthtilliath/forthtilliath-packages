import { useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import {
  OptionsModal,
  type OptionsModalStyles,
  type SelectOption,
} from "./OptionsModal.js";

/** Per-slot style overrides for {@link SelectField}, each merged after its default. */
export interface SelectFieldStyles {
  /** The outer wrapper (`flex: 1`, so two fields share a row evenly). */
  container?: StyleProp<ViewStyle>;
  /** The small caption above the button. */
  label?: StyleProp<TextStyle>;
  /** The bordered button showing the current value. */
  button?: StyleProp<ViewStyle>;
  /** The current value's text. */
  buttonText?: StyleProp<TextStyle>;
  /** The "▾" on the right. */
  chevron?: StyleProp<TextStyle>;
  /** Forwarded to the {@link OptionsModal} opened by the button. */
  optionsModal?: OptionsModalStyles;
}

export interface SelectFieldProps<T extends string | number> {
  /** Caption above the button, e.g. "Mois". */
  label: string;
  /** Text of the current value, shown in the button. */
  valueLabel: string;
  options: readonly SelectOption<T>[];
  onSelect: (value: T) => void;
  /** Per-slot style overrides — see {@link SelectFieldStyles}. */
  styles?: SelectFieldStyles;
}

const defaultStyles = {
  container: { flex: 1 } satisfies ViewStyle,
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    color: "#111111",
  } satisfies TextStyle,
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#d4d4d4",
    borderRadius: 8,
    padding: 10,
  } satisfies ViewStyle,
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  } satisfies TextStyle,
  chevron: { opacity: 0.5, color: "#111111" } satisfies TextStyle,
};

/**
 * A native-looking "select": a captioned button showing the current value,
 * opening an {@link OptionsModal} to pick another one.
 *
 * @example
 * ```tsx
 * import { SelectField } from "@forthtilliath/react-native-kit/components/picker/SelectField";
 *
 * <SelectField
 *   label="Mois"
 *   valueLabel={MONTH_NAMES[month - 1]}
 *   options={MONTH_NAMES.map((name, i) => ({ value: i + 1, label: name }))}
 *   onSelect={setMonth}
 * />
 * ```
 */
export function SelectField<T extends string | number>({
  label,
  valueLabel,
  options,
  onSelect,
  styles,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <View style={merged.container}>
      <Text style={merged.label}>{label}</Text>
      <Pressable
        style={merged.button}
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${valueLabel}`}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text style={merged.buttonText}>{valueLabel}</Text>
        <Text style={merged.chevron}>▾</Text>
      </Pressable>
      <OptionsModal
        visible={open}
        onClose={() => {
          setOpen(false);
        }}
        options={options}
        onSelect={onSelect}
        styles={styles?.optionsModal}
      />
    </View>
  );
}
