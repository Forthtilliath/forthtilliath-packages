import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

export interface PrivacySettingsScreenSection {
  title: string;
  paragraphs: string[];
}

export interface PrivacySettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  paragraph?: StyleProp<TextStyle>;
  separator?: StyleProp<ViewStyle>;
}

export interface PrivacySettingsScreenProps {
  /**
   * Defaults to the standard "everything stays on this device" three
   * sections (no data collected, local storage only, sharing is opt-in).
   * Pass your own to describe a different setup (e.g. an app that does sync
   * to a server) — this fully replaces the default, it isn't merged with it.
   */
  sections?: PrivacySettingsScreenSection[];
  styles?: PrivacySettingsScreenStyles;
}

const defaultSections: PrivacySettingsScreenSection[] = [
  {
    title: "Aucune donnée envoyée nulle part",
    paragraphs: [
      "Cette application ne collecte aucune donnée, ne fait appel à aucun serveur, et ne contient aucun outil de suivi ni de publicité.",
    ],
  },
  {
    title: "Stockage local uniquement",
    paragraphs: [
      "Tout ce que tu saisis reste stocké uniquement sur cet appareil, dans le stockage local de l'application. Rien n'est envoyé ailleurs.",
      "Ces données sont perdues si tu désinstalles l'application ou si tu effaces son stockage — pense à utiliser une sauvegarde régulière pour pouvoir les restaurer.",
    ],
  },
  {
    title: "Partage volontaire uniquement",
    paragraphs: [
      "La seule façon pour une donnée de quitter cet appareil, c'est quand tu choisis toi-même de la partager (export d'une sauvegarde...), via le sélecteur de partage natif du téléphone.",
    ],
  },
];

const defaultStyles: Required<PrivacySettingsScreenStyles> = {
  container: {},
  title: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 6 },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "#e5e7eb",
  },
};

// Privacy section of a settings tab: a list of titled paragraph sections,
// separated by a thin rule. Ships with the standard "everything stays local"
// copy as a default — override `sections` entirely for an app with different
// data handling (e.g. one that does sync to a server).
export function PrivacySettingsScreen({
  sections = defaultSections,
  styles,
}: PrivacySettingsScreenProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    title: [defaultStyles.title, styles?.title],
    paragraph: [defaultStyles.paragraph, styles?.paragraph],
    separator: [defaultStyles.separator, styles?.separator],
  };

  return (
    <View style={merged.container}>
      {sections.map((section, index) => (
        <View key={section.title}>
          {index > 0 && <View style={merged.separator} />}
          <Text style={merged.title}>{section.title}</Text>
          {section.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={merged.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
