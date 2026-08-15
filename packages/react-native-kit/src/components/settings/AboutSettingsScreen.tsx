import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

export interface AboutSettingsScreenSection {
  title: string;
  paragraphs: string[];
}

export interface AboutSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  appName?: StyleProp<TextStyle>;
  version?: StyleProp<TextStyle>;
  separator?: StyleProp<ViewStyle>;
  paragraph?: StyleProp<TextStyle>;
  sectionTitle?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
}

export interface AboutSettingsScreenLabels {
  version?: (version: string) => string;
  developedBy?: (name: string) => string;
}

export interface AboutSettingsScreenProps {
  appName: string;
  version: string;
  /** One or more paragraphs describing the app, rendered in order. */
  description: string | string[];
  /** Extra titled sections after the description, e.g. a medical/legal disclaimer. */
  sections?: AboutSettingsScreenSection[];
  /** Omit to not show a "developed by" credit line at all. */
  developerName?: string;
  labels?: AboutSettingsScreenLabels;
  styles?: AboutSettingsScreenStyles;
}

const defaultLabels: Required<AboutSettingsScreenLabels> = {
  version: (version) => `Version ${version}`,
  developedBy: (name) => `Développée par ${name}.`,
};

const defaultStyles: Required<AboutSettingsScreenStyles> = {
  container: {},
  appName: { fontSize: 22, fontWeight: "700", color: "#111827" },
  version: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  separator: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "#e5e7eb",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  hint: { fontSize: 13, color: "#6b7280" },
};

// App name, version, a short description, optional extra titled sections
// (e.g. a medical/legal disclaimer), and an optional "developed by" credit —
// the standard "About" section of a settings tab. `appName`/`version` are
// required rather than defaulted from `expo-constants` so this stays
// framework-agnostic; pass `Constants.expoConfig?.name`/`.version` from the
// caller.
export function AboutSettingsScreen({
  appName,
  version,
  description,
  sections,
  developerName,
  labels,
  styles,
}: AboutSettingsScreenProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    appName: [defaultStyles.appName, styles?.appName],
    version: [defaultStyles.version, styles?.version],
    separator: [defaultStyles.separator, styles?.separator],
    paragraph: [defaultStyles.paragraph, styles?.paragraph],
    sectionTitle: [defaultStyles.sectionTitle, styles?.sectionTitle],
    hint: [defaultStyles.hint, styles?.hint],
  };
  const t = { ...defaultLabels, ...labels };
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <View style={merged.container}>
      <Text style={merged.appName}>{appName}</Text>
      <Text style={merged.version}>{t.version(version)}</Text>

      <View style={merged.separator} />

      {paragraphs.map((paragraph) => (
        <Text key={paragraph} style={merged.paragraph}>
          {paragraph}
        </Text>
      ))}

      {sections?.map((section) => (
        <View key={section.title}>
          <View style={merged.separator} />
          <Text style={merged.sectionTitle}>{section.title}</Text>
          {section.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={merged.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      ))}

      {developerName && (
        <>
          <View style={merged.separator} />
          <Text style={merged.hint}>{t.developedBy(developerName)}</Text>
        </>
      )}
    </View>
  );
}
