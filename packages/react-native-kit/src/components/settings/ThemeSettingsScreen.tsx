import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

export interface ThemeSettingsScreenEmojis {
  light?: string;
  dark?: string;
  system?: string;
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
  label?: StyleProp<TextStyle>;
  labelActive?: StyleProp<TextStyle>;
  check?: StyleProp<TextStyle>;
}

export interface ThemeSettingsScreenProps {
  value: ThemePreference;
  onChange: (preference: ThemePreference) => void;
  emojis?: ThemeSettingsScreenEmojis;
  labels?: ThemeSettingsScreenLabels;
  styles?: ThemeSettingsScreenStyles;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

const defaultEmojis: Required<ThemeSettingsScreenEmojis> = {
  light: "☀️",
  dark: "🌙",
  system: "⚙️",
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
};

// Selectable list of rows (emoji + label + checkmark) for a light/dark/system
// theme preference — same data contract as `ThemeOptionList`, but an emoji +
// plain-text checkmark instead of vector icons. Pick whichever visual fits
// your app; both cover the exact same `light`/`dark`/`system` preference.
export function ThemeSettingsScreen({
  value,
  onChange,
  emojis,
  labels,
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
  const t = { ...defaultLabels, ...labels };

  return (
    <View style={merged.container}>
      <Text style={merged.hint}>{t.hint}</Text>
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
            <Text style={merged.emoji}>{e[option]}</Text>
            <Text style={[merged.label, active && merged.labelActive]}>
              {t[option]}
            </Text>
            {active && <Text style={merged.check}>✓</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}
