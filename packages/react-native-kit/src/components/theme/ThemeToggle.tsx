import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import { defaultThemeLabels } from "./themeLabels.js";

/** Style overrides of {@link ThemeToggle}, each merged over its default. */
export interface ThemeToggleStyles {
  /** The segmented control. */
  container?: StyleProp<ViewStyle>;
  /** Each segment. */
  option?: StyleProp<ViewStyle>;
  /** Added to the selected segment. */
  optionActive?: StyleProp<ViewStyle>;
  /** Each segment's label. */
  optionText?: StyleProp<TextStyle>;
  /** Added to the selected segment's label. */
  optionTextActive?: StyleProp<TextStyle>;
}

/**
 * Labels of the three choices, whatever the `locale` (shared by {@link
 * ThemeOptionList}).
 */
export interface ThemeToggleLabels {
  /** Label of the light choice. Default: "Clair" / "Light". */
  light?: string;
  /** Label of the dark choice. Default: "Sombre" / "Dark". */
  dark?: string;
  /** Label of the "follow the phone" choice. Default: "Système" / "System". */
  system?: string;
}

/** Props of {@link ThemeToggle}. */
export interface ThemeToggleProps {
  /** The current preference: `light`, `dark` or `system`. */
  value: ThemePreference;
  /** Called with the chosen preference. */
  onChange: (preference: ThemePreference) => void;
  /** Text overrides, whatever the `locale`. */
  labels?: ThemeToggleLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  /** Style overrides, merged over the defaults. */
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

/**
 * 3-way segmented control for a light/dark/system theme preference.
 */
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
