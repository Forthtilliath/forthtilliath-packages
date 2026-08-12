import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Linking, Pressable, Text, View } from "react-native";

export interface ContactSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  hint?: StyleProp<TextStyle>;
  emailButton?: StyleProp<ViewStyle>;
  emailButtonText?: StyleProp<TextStyle>;
  separator?: StyleProp<ViewStyle>;
}

export interface ContactSettingsScreenLabels {
  hint?: string;
  footer?: string;
}

export interface ContactSettingsScreenProps {
  email: string;
  labels?: ContactSettingsScreenLabels;
  styles?: ContactSettingsScreenStyles;
}

const defaultLabels: Required<ContactSettingsScreenLabels> = {
  hint: "Une question, un bug, une suggestion ?",
  footer:
    "Si tu remontes un bug, précise si possible ce que tu faisais et ce que tu attendais — ça aide à le reproduire.",
};

const defaultStyles: Required<ContactSettingsScreenStyles> = {
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
};

// A mailto: button plus a short "how to report a bug" hint — the standard
// "Contact" section of a settings tab.
export function ContactSettingsScreen({
  email,
  labels,
  styles,
}: ContactSettingsScreenProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    hint: [defaultStyles.hint, styles?.hint],
    emailButton: [defaultStyles.emailButton, styles?.emailButton],
    emailButtonText: [defaultStyles.emailButtonText, styles?.emailButtonText],
    separator: [defaultStyles.separator, styles?.separator],
  };
  const t = { ...defaultLabels, ...labels };

  return (
    <View style={merged.container}>
      <Text style={merged.hint}>{t.hint}</Text>

      <Pressable
        style={merged.emailButton}
        onPress={() => {
          void Linking.openURL(`mailto:${email}`);
        }}
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
