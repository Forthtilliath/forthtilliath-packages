import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

export interface ThemeSettingsScreenEmojis {
  light?: string;
  dark?: string;
  system?: string;
}

export interface ThemeSettingsScreenIcons {
  light?: keyof typeof Ionicons.glyphMap;
  dark?: keyof typeof Ionicons.glyphMap;
  system?: keyof typeof Ionicons.glyphMap;
}

export interface ThemeSettingsScreenLabels {
  light?: string;
  dark?: string;
  system?: string;
  hint?: string;
}

export interface ThemeSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  hint?: StyleProp<TextStyle>;
  row?: StyleProp<ViewStyle>;
  rowActive?: StyleProp<ViewStyle>;
  emoji?: StyleProp<TextStyle>;
  iconColor?: string;
  iconColorActive?: string;
  label?: StyleProp<TextStyle>;
  labelActive?: StyleProp<TextStyle>;
  check?: StyleProp<TextStyle>;
  checkColor?: string;
}

export interface ThemeSettingsScreenProps {
  value: ThemePreference;
  onChange: (preference: ThemePreference) => void;
  /**
   * `"emoji"` (default): colorful emoji + a plain-text `✓`. `"icon"`:
   * `Ionicons` glyphs in one shared color (`styles.iconColor`) + an
   * `Ionicons` checkmark, for a flatter, more uniform look — matches
   * `SettingsMenu`'s `defaultIconKind`.
   */
  variant?: "emoji" | "icon";
  emojis?: ThemeSettingsScreenEmojis;
  icons?: ThemeSettingsScreenIcons;
  labels?: ThemeSettingsScreenLabels;
  /** Set to `false` to hide the hint above the list. Defaults to `true`. */
  showHint?: boolean;
  styles?: ThemeSettingsScreenStyles;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

const defaultEmojis: Required<ThemeSettingsScreenEmojis> = {
  light: "☀️",
  dark: "🌙",
  system: "⚙️",
};

const defaultIcons: Required<ThemeSettingsScreenIcons> = {
  light: "sunny-outline",
  dark: "moon-outline",
  system: "phone-portrait-outline",
};

const defaultLabels: Required<ThemeSettingsScreenLabels> = {
  light: "Clair",
  dark: "Sombre",
  system: "Système",
  hint: "« Système » suit automatiquement le réglage clair/sombre de ton téléphone.",
};

const defaultStyles = {
  container: { gap: 10 } satisfies ViewStyle,
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 6 } satisfies TextStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
  } satisfies ViewStyle,
  rowActive: {
    borderColor: "#2563eb",
    backgroundColor: "#2563eb1a",
  } satisfies ViewStyle,
  emoji: { fontSize: 20 } satisfies TextStyle,
  iconColor: "#111827",
  iconColorActive: "#2563eb",
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  } satisfies TextStyle,
  labelActive: { color: "#2563eb" } satisfies TextStyle,
  check: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  } satisfies TextStyle,
  checkColor: "#2563eb",
};

// Selectable list of rows (icon + label + checkmark) for a light/dark/system
// theme preference — same data contract as `ThemeOptionList`, but with a
// second visual (`variant="emoji"`, the default) alongside the vector-icon
// one (`variant="icon"`). Pick whichever fits your app; both cover the exact
// same `light`/`dark`/`system` preference.
export function ThemeSettingsScreen({
  value,
  onChange,
  variant = "emoji",
  emojis,
  icons,
  labels,
  showHint = true,
  styles,
}: ThemeSettingsScreenProps) {
  // Style fields are merged as arrays (default, then override) so a partial
  // override only changes the properties it specifies instead of replacing
  // the whole default style object.
  const merged = {
    container: [defaultStyles.container, styles?.container],
    hint: [defaultStyles.hint, styles?.hint],
    row: [defaultStyles.row, styles?.row],
    rowActive: [defaultStyles.rowActive, styles?.rowActive],
    emoji: [defaultStyles.emoji, styles?.emoji],
    label: [defaultStyles.label, styles?.label],
    labelActive: [defaultStyles.labelActive, styles?.labelActive],
    check: [defaultStyles.check, styles?.check],
  };
  const e = { ...defaultEmojis, ...emojis };
  const i = { ...defaultIcons, ...icons };
  const t = { ...defaultLabels, ...labels };
  const iconColor = styles?.iconColor ?? defaultStyles.iconColor;
  const iconColorActive =
    styles?.iconColorActive ?? defaultStyles.iconColorActive;
  const checkColor = styles?.checkColor ?? defaultStyles.checkColor;

  return (
    <View style={merged.container}>
      {showHint && <Text style={merged.hint}>{t.hint}</Text>}
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
            {variant === "icon" ? (
              <Ionicons
                name={i[option]}
                size={20}
                color={active ? iconColorActive : iconColor}
              />
            ) : (
              <Text style={merged.emoji}>{e[option]}</Text>
            )}
            <Text style={[merged.label, active && merged.labelActive]}>
              {t[option]}
            </Text>
            {active &&
              (variant === "icon" ? (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={checkColor}
                />
              ) : (
                <Text style={merged.check}>✓</Text>
              ))}
          </Pressable>
        );
      })}
    </View>
  );
}
