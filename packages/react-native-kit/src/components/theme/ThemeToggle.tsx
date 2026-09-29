import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import { defaultThemeLabels } from "./themeLabels.js";

export interface ThemeToggleStyles {
  container?: StyleProp<ViewStyle>;
  option?: StyleProp<ViewStyle>;
  optionActive?: StyleProp<ViewStyle>;
  optionText?: StyleProp<TextStyle>;
  optionTextActive?: StyleProp<TextStyle>;
}

export interface ThemeToggleLabels {
  light?: string;
  dark?: string;
  system?: string;
}

export interface ThemeToggleProps {
  value: ThemePreference;
  onChange: (preference: ThemePreference) => void;
  labels?: ThemeToggleLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  styles?: ThemeToggleStyles;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

const defaultStyles: Required<ThemeToggleStyles> = {
  container: { flexDirection: "row", gap: 8 },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  optionActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  optionText: { fontSize: 15, fontWeight: "600", color: "#111827" },
  optionTextActive: { color: "#ffffff" },
};

// 3-way segmented control for a light/dark/system theme preference.
export function ThemeToggle({
  value,
  onChange,
  labels,
  locale,
  styles,
}: ThemeToggleProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const t = { ...defaultThemeLabels[useKitLocale(locale)], ...labels };

  return (
    <View style={merged.container}>
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={[merged.option, active && merged.optionActive]}
            onPress={() => {
              onChange(option);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t[option]}
          >
            <Text
              style={[merged.optionText, active && merged.optionTextActive]}
            >
              {t[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
