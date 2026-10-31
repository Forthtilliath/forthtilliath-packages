import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import { defaultThemeLabels } from "./themeLabels.js";
import type { ThemeToggleLabels } from "./ThemeToggle.js";

/** Ionicons of each row of {@link ThemeOptionList}. */
export interface ThemeOptionListIcons {
  /** Icon of the light row. */
  light?: keyof typeof Ionicons.glyphMap;
  /** Icon of the dark row. */
  dark?: keyof typeof Ionicons.glyphMap;
  /** Icon of the "follow the phone" row. */
  system?: keyof typeof Ionicons.glyphMap;
}

/** Style overrides of {@link ThemeOptionList}, each merged over its default. */
export interface ThemeOptionListStyles {
  /** The list. */
  container?: StyleProp<ViewStyle>;
  /** Each row. */
  row?: StyleProp<ViewStyle>;
  /** Added to the selected row. */
  rowActive?: StyleProp<ViewStyle>;
  /** Each label. */
  label?: StyleProp<TextStyle>;
  /** Added to the selected row's label. */
  labelActive?: StyleProp<TextStyle>;
  /** Not a style: color of the icons. */
  iconColor?: string;
  /** Not a style: color of the selected row's icon. */
  iconColorActive?: string;
  /** Not a style: color of the checkmark. */
  checkColor?: string;
}

/** Props of {@link ThemeOptionList}. */
export interface ThemeOptionListProps {
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
  /** Icon overrides. */
  icons?: ThemeOptionListIcons;
  /** Style overrides, merged over the defaults. */
  styles?: ThemeOptionListStyles;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

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

/**
 * Selectable list of rows (icon + label + checkmark) for a light/dark/system
 * theme preference. Same data contract as ThemeToggle, but a taller row-based
 * layout instead of a 3-way segmented control.
 */
export function ThemeOptionList({
  value,
  onChange,
  labels,
  locale,
  icons,
  styles,
}: ThemeOptionListProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const t = { ...defaultThemeLabels[useKitLocale(locale)], ...labels };
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
