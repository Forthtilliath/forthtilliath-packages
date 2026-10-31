import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Linking, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** An extra row of {@link ContactSettingsScreen} (share the app, donate…). */
export interface ContactSettingsScreenAction {
  /** Ionicons name of the row's icon. */
  icon: keyof typeof Ionicons.glyphMap;
  /** Text of the row. */
  label: string;
  /** Called when the row is pressed. */
  onPress: () => void;
  /**
   * What TalkBack reads, when the label alone isn't explicit enough. Defaults
   * to `label`.
   */
  accessibilityLabel?: string;
}

/**
 * Style overrides of {@link ContactSettingsScreen}, each merged over its
 * default.
 */
export interface ContactSettingsScreenStyles {
  /** The screen's root view. */
  container?: StyleProp<ViewStyle>;
  /** The hint above and the footer below. */
  hint?: StyleProp<TextStyle>;
  /** The bordered `mailto:` button (single-button layout). */
  emailButton?: StyleProp<ViewStyle>;
  /** Its text (the address). */
  emailButtonText?: StyleProp<TextStyle>;
  /** The line above the footer. */
  separator?: StyleProp<ViewStyle>;
  /** Only used when `actions` is set (rows layout). */
  row?: StyleProp<ViewStyle>;
  /** Each row's label (rows layout). */
  rowText?: StyleProp<TextStyle>;
  /** Not a style: color of the rows' icons. */
  rowIconColor?: string;
}

/** Text overrides of {@link ContactSettingsScreen}, whatever the `locale`. */
export interface ContactSettingsScreenLabels {
  /**
   * Line above the email. Default: "Une question, un bug, une suggestion ?".
   */
  hint?: string;
  /**
   * Advice at the bottom on reporting a bug (what you were doing, what you
   * expected).
   */
  footer?: string;
  /**
   * Only used when `actions` is set — the email row's label (the button itself
   * shows the address in the default single-button layout).
   */
  emailRowLabel?: string;
}

/** Props of {@link ContactSettingsScreen}. */
export interface ContactSettingsScreenProps {
  /** Address the `mailto:` link opens. */
  email: string;
  /**
   * Extra rows below the email one (icon + label). Setting this switches
   * the whole section from a single bordered `mailto:` button to a list of
   * icon rows — the email becomes the first row (icon defaults to
   * `emailIcon`, label to `labels.emailRowLabel`) instead of the button.
   */
  actions?: ContactSettingsScreenAction[];
  /** Icon of the email row (rows layout). */
  emailIcon?: keyof typeof Ionicons.glyphMap;
  /** Text overrides, whatever the `locale`. */
  labels?: ContactSettingsScreenLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  /** Style overrides, merged over the defaults. */
  styles?: ContactSettingsScreenStyles;
}

const defaultLabels = {
  fr: {
    hint: "Une question, un bug, une suggestion ?",
    footer:
      "Si tu remontes un bug, précise si possible ce que tu faisais et ce que tu attendais — ça aide à le reproduire.",
    emailRowLabel: "Me contacter",
  },
  en: {
    hint: "A question, a bug, a suggestion?",
    footer:
      "When reporting a bug, please describe what you were doing and what you expected — it helps reproduce it.",
    emailRowLabel: "Contact me",
  },
} satisfies Record<KitLocale, Required<ContactSettingsScreenLabels>>;

const defaultStyles: Required<
  Omit<ContactSettingsScreenStyles, "rowIconColor">
> &
  Pick<ContactSettingsScreenStyles, "rowIconColor"> = {
  container: {},
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  emailButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    alignItems: "center",
  },
  emailButtonText: { color: "#2563eb", fontWeight: "700" },
  separator: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  rowText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#111827" },
  rowIconColor: "#111827",
};

/**
 * A mailto: button plus a short "how to report a bug" hint — the standard
 * "Contact" section of a settings tab. Pass `actions` for extra rows (share
 * the app, a donation link...), switching email + those to a rows layout.
 */
export function ContactSettingsScreen({
  email,
  actions,
  emailIcon = "mail-outline",
  labels,
  locale,
  styles,
}: ContactSettingsScreenProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };
  const rowIconColor = styles?.rowIconColor ?? defaultStyles.rowIconColor;

  function openEmail() {
    void Linking.openURL(`mailto:${email}`);
  }

  if (actions) {
    return (
      <View style={merged.container}>
        <Text style={merged.hint}>{t.hint}</Text>

        <Pressable
          style={merged.row}
          onPress={openEmail}
          accessibilityRole="button"
          accessibilityLabel={`Envoyer un email à ${email}`}
        >
          <Ionicons name={emailIcon} size={20} color={rowIconColor} />
          <Text style={merged.rowText}>{t.emailRowLabel}</Text>
        </Pressable>

        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={merged.row}
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel ?? action.label}
          >
            <Ionicons name={action.icon} size={20} color={rowIconColor} />
            <Text style={merged.rowText}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={merged.container}>
      <Text style={merged.hint}>{t.hint}</Text>

      <Pressable
        style={merged.emailButton}
        onPress={openEmail}
        accessibilityRole="button"
        accessibilityLabel={`Envoyer un email à ${email}`}
      >
        <Text style={merged.emailButtonText}>{`✉️ ${email}`}</Text>
      </Pressable>

      <View style={merged.separator} />

      <Text style={merged.hint}>{t.footer}</Text>
    </View>
  );
}
