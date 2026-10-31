import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Emoji of each row with `variant="emoji"`. Defaults: ☀️, 🌙, ⚙️. */
export interface ThemeSettingsScreenEmojis {
  /** Emoji of the light row. */
  light?: string;
  /** Emoji of the dark row. */
  dark?: string;
  /** Emoji of the "follow the phone" row. */
  system?: string;
}

/**
 * Ionicons of each row with `variant="icon"`. Defaults: `sunny-outline`,
 * `moon-outline`, `phone-portrait-outline`.
 */
export interface ThemeSettingsScreenIcons {
  /** Icon of the light row. */
  light?: keyof typeof Ionicons.glyphMap;
  /** Icon of the dark row. */
  dark?: keyof typeof Ionicons.glyphMap;
  /** Icon of the "follow the phone" row. */
  system?: keyof typeof Ionicons.glyphMap;
}

/** Text overrides of {@link ThemeSettingsScreen}, whatever the `locale`. */
export interface ThemeSettingsScreenLabels {
  /** Label of the light row. Default: "Clair" / "Light". */
  light?: string;
  /** Label of the dark row. Default: "Sombre" / "Dark". */
  dark?: string;
  /** Label of the "follow the phone" row. Default: "Système" / "System". */
  system?: string;
  /** Explanation above the list (what "System" does). */
  hint?: string;
}

/**
 * Style overrides of {@link ThemeSettingsScreen}, each merged over its default.
 */
export interface ThemeSettingsScreenStyles {
  /** The list. */
  container?: StyleProp<ViewStyle>;
  /** The hint above it. */
  hint?: StyleProp<TextStyle>;
  /** Each row. */
  row?: StyleProp<ViewStyle>;
  /** Added to the selected row. */
  rowActive?: StyleProp<ViewStyle>;
  /** The emoji (`variant="emoji"`). */
  emoji?: StyleProp<TextStyle>;
  /** Not a style: color of the icons (`variant="icon"`). */
  iconColor?: string;
  /** Not a style: color of the selected row's icon. */
  iconColorActive?: string;
  /** Each label. */
  label?: StyleProp<TextStyle>;
  /** Added to the selected row's label. */
  labelActive?: StyleProp<TextStyle>;
  /** The text `✓` of the selected row (`variant="emoji"`). */
  check?: StyleProp<TextStyle>;
  /** Not a style: color of the checkmark icon (`variant="icon"`). */
  checkColor?: string;
}

/** Props of {@link ThemeSettingsScreen}. */
export interface ThemeSettingsScreenProps {
  /** The current preference: `light`, `dark` or `system`. */
  value: ThemePreference;
  /**
   * Called with the chosen preference (persist it, e.g. through
   * `ThemePreferenceProvider`).
   */
  onChange: (preference: ThemePreference) => void;
  /**
   * `"emoji"` (default): colorful emoji + a plain-text `✓`. `"icon"`:
   * `Ionicons` glyphs in one shared color (`styles.iconColor`) + an
   * `Ionicons` checkmark, for a flatter, more uniform look — matches
   * `SettingsMenu`'s `defaultIconKind`.
   */
  variant?: "emoji" | "icon";
  /** Emoji overrides (`variant="emoji"`). */
  emojis?: ThemeSettingsScreenEmojis;
  /** Icon overrides (`variant="icon"`). */
  icons?: ThemeSettingsScreenIcons;
  /** Text overrides, whatever the `locale`. */
  labels?: ThemeSettingsScreenLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  /** Set to `false` to hide the hint above the list. Defaults to `true`. */
  showHint?: boolean;
  /** Style overrides, merged over the defaults. */
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

const defaultLabels = {
  fr: {
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    hint: "« Système » suit automatiquement le réglage clair/sombre de ton téléphone.",
  },
  en: {
    light: "Light",
    dark: "Dark",
    system: "System",
    hint: "“System” automatically follows your phone's light/dark setting.",
  },
} satisfies Record<KitLocale, Required<ThemeSettingsScreenLabels>>;

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

/**
 * Selectable list of rows (icon + label + checkmark) for a light/dark/system
 * theme preference — same data contract as `ThemeOptionList`, but with a
 * second visual (`variant="emoji"`, the default) alongside the vector-icon
 * one (`variant="icon"`). Pick whichever fits your app; both cover the exact
 * same `light`/`dark`/`system` preference.
 */
export function ThemeSettingsScreen({
  value,
  onChange,
  variant = "emoji",
  emojis,
  icons,
  labels,
  locale,
  showHint = true,
  styles,
}: ThemeSettingsScreenProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const e = { ...defaultEmojis, ...emojis };
  const i = { ...defaultIcons, ...icons };
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };
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
