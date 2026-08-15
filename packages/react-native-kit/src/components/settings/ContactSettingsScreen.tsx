import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Linking, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ContactSettingsScreenAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface ContactSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  hint?: StyleProp<TextStyle>;
  emailButton?: StyleProp<ViewStyle>;
  emailButtonText?: StyleProp<TextStyle>;
  separator?: StyleProp<ViewStyle>;
  /** Only used when `actions` is set (rows layout). */
  row?: StyleProp<ViewStyle>;
  rowText?: StyleProp<TextStyle>;
  rowIconColor?: string;
}

export interface ContactSettingsScreenLabels {
  hint?: string;
  footer?: string;
  /** Only used when `actions` is set — the email row's label (the button itself shows the address in the default single-button layout). */
  emailRowLabel?: string;
}

export interface ContactSettingsScreenProps {
  email: string;
  /**
   * Extra rows below the email one (icon + label). Setting this switches
   * the whole section from a single bordered `mailto:` button to a list of
   * icon rows — the email becomes the first row (icon defaults to
   * `emailIcon`, label to `labels.emailRowLabel`) instead of the button.
   */
  actions?: ContactSettingsScreenAction[];
  emailIcon?: keyof typeof Ionicons.glyphMap;
  labels?: ContactSettingsScreenLabels;
  styles?: ContactSettingsScreenStyles;
}

const defaultLabels: Required<ContactSettingsScreenLabels> = {
  hint: "Une question, un bug, une suggestion ?",
  footer:
    "Si tu remontes un bug, précise si possible ce que tu faisais et ce que tu attendais — ça aide à le reproduire.",
  emailRowLabel: "Me contacter",
};

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

// A mailto: button plus a short "how to report a bug" hint — the standard
// "Contact" section of a settings tab. Pass `actions` for extra rows (share
// the app, a donation link...), switching email + those to a rows layout.
export function ContactSettingsScreen({
  email,
  actions,
  emailIcon = "mail-outline",
  labels,
  styles,
}: ContactSettingsScreenProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    hint: [defaultStyles.hint, styles?.hint],
    emailButton: [defaultStyles.emailButton, styles?.emailButton],
    emailButtonText: [defaultStyles.emailButtonText, styles?.emailButtonText],
    separator: [defaultStyles.separator, styles?.separator],
    row: [defaultStyles.row, styles?.row],
    rowText: [defaultStyles.rowText, styles?.rowText],
  };
  const t = { ...defaultLabels, ...labels };
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
