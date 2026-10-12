import type { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Switch, Text, View } from "react-native";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link SwitchRow}, each merged after its default. */
export interface SwitchRowStyles {
  /** The pressable row (border and background included). */
  row?: StyleProp<ViewStyle>;
  /** The column holding the label and description. */
  texts?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  description?: StyleProp<TextStyle>;
}

/** Colors of the switch itself — React Native's `Switch` takes no `style` for them. */
export interface SwitchRowColors {
  trackOff?: ColorValue;
  trackOn?: ColorValue;
  thumbOff?: ColorValue;
  thumbOn?: ColorValue;
}

export interface SwitchRowProps {
  label: string;
  /** A line under the label, also read as the screen-reader hint. */
  description?: string;
  value: boolean;
  /** Receives the new value — from the switch or from a tap anywhere on the row. */
  onChange: (value: boolean) => void;
  disabled?: boolean;
  /** Switch colors; unset ones keep the platform default. */
  colors?: SwitchRowColors;
  /** Per-slot style overrides — see {@link SwitchRowStyles}. */
  styles?: SwitchRowStyles;
}

const defaultStyles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  } satisfies ViewStyle,
  texts: { flex: 1, gap: 2 } satisfies ViewStyle,
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  } satisfies TextStyle,
  description: { fontSize: 13, color: "#6b7280" } satisfies TextStyle,
};

/**
 * A settings line: label, optional description, and a switch — the whole
 * row is pressable and announced as one switch by screen readers.
 *
 * @example
 * ```tsx
 * import { SwitchRow } from "@forthtilliath/react-native-kit/components/settings/SwitchRow";
 *
 * <SwitchRow
 *   label="Équipes aléatoires"
 *   description="Mélange les joueurs avant de former les équipes"
 *   value={randomTeams}
 *   onChange={setRandomTeams}
 * />
 * ```
 */
export function SwitchRow({
  label,
  description,
  value,
  onChange,
  disabled = false,
  colors,
  styles,
}: SwitchRowProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);

  return (
    <Pressable
      style={merged.row}
      onPress={() => {
        onChange(!value);
      }}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
    >
      <View style={merged.texts}>
        <Text style={merged.label}>{label}</Text>
        {description !== undefined && (
          <Text style={merged.description}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors?.trackOff, true: colors?.trackOn }}
        thumbColor={value ? colors?.thumbOn : colors?.thumbOff}
        // The row already announces the switch: hide this one from screen
        // readers so it isn't read twice.
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      />
    </Pressable>
  );
}
