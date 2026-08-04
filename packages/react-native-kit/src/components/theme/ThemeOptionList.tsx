import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

import type { ThemeToggleLabels } from "./ThemeToggle.js";

export interface ThemeOptionListIcons {
  light?: keyof typeof Ionicons.glyphMap;
  dark?: keyof typeof Ionicons.glyphMap;
  system?: keyof typeof Ionicons.glyphMap;
}

export interface ThemeOptionListStyles {
  container?: StyleProp<ViewStyle>;
  row?: StyleProp<ViewStyle>;
  rowActive?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  labelActive?: StyleProp<TextStyle>;
  iconColor?: string;
  iconColorActive?: string;
  checkColor?: string;
}

export interface ThemeOptionListProps {
  value: ThemePreference;
  onChange: (preference: ThemePreference) => void;
  labels?: ThemeToggleLabels;
  icons?: ThemeOptionListIcons;
  styles?: ThemeOptionListStyles;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

const defaultLabels: Required<ThemeToggleLabels> = {
  light: "Clair",
  dark: "Sombre",
  system: "Système",
};

const defaultIcons: Required<ThemeOptionListIcons> = {
  light: "sunny-outline",
  dark: "moon-outline",
  system: "phone-portrait-outline",
};

const defaultStyles = {
  container: { gap: 8 } satisfies ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#ffffff",
  } satisfies ViewStyle,
  rowActive: {
    borderColor: "#2563eb",
    backgroundColor: "#2563eb1a",
  } satisfies ViewStyle,
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  } satisfies TextStyle,
  labelActive: { color: "#2563eb" } satisfies TextStyle,
  iconColor: "#111827",
  iconColorActive: "#2563eb",
  checkColor: "#2563eb",
};

// Selectable list of rows (icon + label + checkmark) for a light/dark/system
// theme preference. Same data contract as ThemeToggle, but a taller row-based
// layout instead of a 3-way segmented control.
export function ThemeOptionList({
  value,
  onChange,
  labels,
  icons,
  styles,
}: ThemeOptionListProps) {
  // Style fields are merged as arrays (default, then override) so a partial
  // override only changes the properties it specifies instead of replacing
  // the whole default style object.
  const merged = {
    container: [defaultStyles.container, styles?.container],
    row: [defaultStyles.row, styles?.row],
    rowActive: [defaultStyles.rowActive, styles?.rowActive],
    label: [defaultStyles.label, styles?.label],
    labelActive: [defaultStyles.labelActive, styles?.labelActive],
  };
  const t = { ...defaultLabels, ...labels };
  const i = { ...defaultIcons, ...icons };
  const iconColor = styles?.iconColor ?? defaultStyles.iconColor;
  const iconColorActive =
    styles?.iconColorActive ?? defaultStyles.iconColorActive;
  const checkColor = styles?.checkColor ?? defaultStyles.checkColor;

  return (
    <View style={merged.container}>
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={[merged.row, active && merged.rowActive]}
            onPress={() => {
              onChange(option);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={t[option]}
          >
            <Ionicons
              name={i[option]}
              size={20}
              color={active ? iconColorActive : iconColor}
            />
            <Text style={[merged.label, active && merged.labelActive]}>
              {t[option]}
            </Text>
            {active && (
              <Ionicons name="checkmark-circle" size={20} color={checkColor} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
