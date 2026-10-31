import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** An extra titled section of {@link AboutSettingsScreen}. */
export interface AboutSettingsScreenSection {
  /** Title of the section. */
  title: string;
  /** Its paragraphs, in order. */
  paragraphs: string[];
}

/**
 * Style overrides of {@link AboutSettingsScreen}, each merged over its default.
 */
export interface AboutSettingsScreenStyles {
  /** The screen's root view. */
  container?: StyleProp<ViewStyle>;
  /** The app's name. */
  appName?: StyleProp<TextStyle>;
  /** The version line. */
  version?: StyleProp<TextStyle>;
  /** The line between the header and the text. */
  separator?: StyleProp<ViewStyle>;
  /** Each paragraph. */
  paragraph?: StyleProp<TextStyle>;
  /** Titles of the extra sections. */
  sectionTitle?: StyleProp<TextStyle>;
  /** The "developed by" credit. */
  hint?: StyleProp<TextStyle>;
}

/** Text overrides of {@link AboutSettingsScreen}, whatever the `locale`. */
export interface AboutSettingsScreenLabels {
  /** Builds the version line. Default: "Version {version}". */
  version?: (version: string) => string;
  /**
   * Builds the credit line. Default: "Développée par {name}." / "Developed by
   * {name}.".
   */
  developedBy?: (name: string) => string;
}

/** Props of {@link AboutSettingsScreen}. */
export interface AboutSettingsScreenProps {
  /** The app's name, as a title. */
  appName: string;
  /** The installed version, e.g. `Constants.expoConfig?.version`. */
  version: string;
  /** One or more paragraphs describing the app, rendered in order. */
  description: string | string[];
  /**
   * Extra titled sections after the description, e.g. a medical/legal
   * disclaimer.
   */
  sections?: AboutSettingsScreenSection[];
  /** Omit to not show a "developed by" credit line at all. */
  developerName?: string;
  /** Text overrides, whatever the `locale`. */
  labels?: AboutSettingsScreenLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  /** Style overrides, merged over the defaults. */
  styles?: AboutSettingsScreenStyles;
}

const defaultLabels = {
  fr: {
    version: (version: string) => `Version ${version}`,
    developedBy: (name: string) => `Développée par ${name}.`,
  },
  en: {
    version: (version: string) => `Version ${version}`,
    developedBy: (name: string) => `Developed by ${name}.`,
  },
} satisfies Record<KitLocale, Required<AboutSettingsScreenLabels>>;

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

/**
 * App name, version, a short description, optional extra titled sections
 * (e.g. a medical/legal disclaimer), and an optional "developed by" credit —
 * the standard "About" section of a settings tab. `appName`/`version` are
 * required rather than defaulted from `expo-constants` so this stays
 * framework-agnostic; pass `Constants.expoConfig?.name`/`.version` from the
 * caller.
 */
export function AboutSettingsScreen({
  appName,
  version,
  description,
  sections,
  developerName,
  labels,
  locale,
  styles,
}: AboutSettingsScreenProps) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };
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
