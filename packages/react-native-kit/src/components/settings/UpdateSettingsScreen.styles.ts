import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import type { ChangelogNotesStyles } from "@forthtilliath/expo-release-updates-ui";

export interface UpdateSettingsScreenRelease {
  version: string;
  notes: string;
  apkUrl: string;
}

export interface UpdateSettingsScreenHistoryEntry {
  version: string;
  notes: string;
  publishedAt?: string | null;
}

export interface UpdateSettingsScreenLabels {
  installedVersionLabel?: string;
  checkButton?: string;
  upToDate?: string;
  checkError?: string;
  downloadError?: string;
  availableTitle?: (version: string) => string;
  installButton?: (version: string) => string;
  installButtonAccessibilityLabel?: (version: string) => string;
  downloadingLabel?: (percent: number) => string;
  downloadingHint?: string;
  historyTitle?: string;
}

export interface UpdateSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  infoBox?: StyleProp<ViewStyle>;
  infoLabel?: StyleProp<TextStyle>;
  infoValue?: StyleProp<TextStyle>;
  helpText?: StyleProp<TextStyle>;
  errorText?: StyleProp<TextStyle>;
  button?: StyleProp<ViewStyle>;
  buttonDisabled?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
  activityIndicatorColor?: string;
  updateAvailableBox?: StyleProp<ViewStyle>;
  updateAvailableTitle?: StyleProp<TextStyle>;
  changelog?: StyleProp<ViewStyle>;
  changelogTitle?: StyleProp<TextStyle>;
  changelogEntry?: StyleProp<ViewStyle>;
  changelogEntryHeader?: StyleProp<ViewStyle>;
  changelogVersion?: StyleProp<TextStyle>;
  changelogDate?: StyleProp<TextStyle>;
  notes?: ChangelogNotesStyles;
}

export const defaultLabels: Required<UpdateSettingsScreenLabels> = {
  installedVersionLabel: "Version installée",
  checkButton: "Rechercher une mise à jour",
  upToDate: "Tu as déjà la dernière version.",
  checkError: "Impossible de vérifier les mises à jour.",
  downloadError: "Le téléchargement a échoué.",
  availableTitle: (version) => `Version ${version} disponible`,
  installButton: () => "Télécharger et installer",
  installButtonAccessibilityLabel: (version) =>
    `Télécharger et installer la version ${version}`,
  downloadingLabel: (percent) => `Téléchargement… ${String(percent)}%`,
  downloadingHint:
    "Ton téléphone va ensuite te demander confirmation pour installer la mise à jour.",
  historyTitle: "Historique des versions",
};

export const defaultStyles: Required<
  Omit<UpdateSettingsScreenStyles, "activityIndicatorColor" | "notes">
> &
  Pick<UpdateSettingsScreenStyles, "activityIndicatorColor" | "notes"> = {
  container: { gap: 4 },
  infoBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  infoLabel: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  helpText: { fontSize: 12, color: "#6b7280", marginTop: 8 },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 8 },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  activityIndicatorColor: "#ffffff",
  updateAvailableBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    gap: 4,
  },
  updateAvailableTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  changelog: { marginTop: 28 },
  changelogTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  changelogEntry: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  changelogEntryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changelogVersion: { fontSize: 14, fontWeight: "700", color: "#111827" },
  changelogDate: { fontSize: 12, color: "#6b7280" },
  notes: undefined,
};
