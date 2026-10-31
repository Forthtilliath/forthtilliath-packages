import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import type { ChangelogNotesStyles } from "@forthtilliath/expo-release-updates-ui";

import type { KitLocale } from "../../i18n/locale.js";

import type { SwitchRowColors, SwitchRowStyles } from "./SwitchRow.js";

/**
 * A release returned by `checkForUpdate` (the shape of `fetchLatestRelease`'s
 * result).
 */
export interface UpdateSettingsScreenRelease {
  /** Its version, compared with `currentVersion`. */
  version: string;
  /** Its release notes (Markdown subset), shown in the update box. */
  notes: string;
  /** Download URL of its APK, handed to `downloadAndInstallApk`. */
  apkUrl: string;
  /** SHA-256 of the APK, handed back to `downloadAndInstallApk`. */
  apkSha256?: string;
}

/**
 * One past release of the version history (the shape of `fetchReleaseHistory`'s
 * entries).
 */
export interface UpdateSettingsScreenHistoryEntry {
  /** Its version. */
  version: string;
  /** Its release notes (Markdown subset). */
  notes: string;
  /**
   * When it was published (ISO 8601), formatted with `dateLocale`; hidden when
   * missing.
   */
  publishedAt?: string | null;
}

/** Text overrides of {@link UpdateSettingsScreen}, whatever the `locale`. */
export interface UpdateSettingsScreenLabels {
  /** Caption of the installed version box. */
  installedVersionLabel?: string;
  /** Label of the manual check button. */
  checkButton?: string;
  /** Shown when no newer version exists. */
  upToDate?: string;
  /** Shown when the check failed (offline…). */
  checkError?: string;
  /** Shown when the download or the install hand-off failed. */
  downloadError?: string;
  /** Title of the update box, from the available version. */
  availableTitle?: (version: string) => string;
  /**
   * Label of the install button, from the version. Default: "Télécharger et
   * installer".
   */
  installButton?: (version: string) => string;
  /** What TalkBack reads on the install button, from the version. */
  installButtonAccessibilityLabel?: (version: string) => string;
  /** Progress line, from the rounded percentage. */
  downloadingLabel?: (percent: number) => string;
  /** Line under the progress: Android will ask for confirmation. */
  downloadingHint?: string;
  /** Title of the version history. */
  historyTitle?: string;
  /** Label of the "test versions" switch. */
  prereleaseLabel?: string;
  /** Description under that switch (alpha / beta, may contain bugs). */
  prereleaseDescription?: string;
}

/**
 * Style overrides of {@link UpdateSettingsScreen}, each merged over its
 * default.
 */
export interface UpdateSettingsScreenStyles {
  /** The screen's root view. */
  container?: StyleProp<ViewStyle>;
  /** The installed version box. */
  infoBox?: StyleProp<ViewStyle>;
  /** Its caption. */
  infoLabel?: StyleProp<TextStyle>;
  /** The version number. */
  infoValue?: StyleProp<TextStyle>;
  /** Status lines (up to date, download hint). */
  helpText?: StyleProp<TextStyle>;
  /** Check and download errors. */
  errorText?: StyleProp<TextStyle>;
  /** The check and install buttons. */
  button?: StyleProp<ViewStyle>;
  /** Added to a button while a check or a download runs. */
  buttonDisabled?: StyleProp<ViewStyle>;
  /** Their labels. */
  buttonText?: StyleProp<TextStyle>;
  /** Not a style: color of the spinners. */
  activityIndicatorColor?: string;
  /** The box announcing an available update. */
  updateAvailableBox?: StyleProp<ViewStyle>;
  /** Its title. */
  updateAvailableTitle?: StyleProp<TextStyle>;
  /** The version history section. */
  changelog?: StyleProp<ViewStyle>;
  /** Its title. */
  changelogTitle?: StyleProp<TextStyle>;
  /** Each past release. */
  changelogEntry?: StyleProp<ViewStyle>;
  /** Row holding a release's version and date. */
  changelogEntryHeader?: StyleProp<ViewStyle>;
  /** A release's version. */
  changelogVersion?: StyleProp<TextStyle>;
  /** A release's date. */
  changelogDate?: StyleProp<TextStyle>;
  /** Styles of every release notes block, forwarded to `ChangelogNotes`. */
  notes?: ChangelogNotesStyles;
  /**
   * The "test versions" switch row, shown with `onIncludePrereleasesChange`.
   */
  prereleaseSwitch?: SwitchRowStyles;
  /** Colors of the "test versions" switch. */
  prereleaseSwitchColors?: SwitchRowColors;
}

/** Built-in texts of {@link UpdateSettingsScreen}, per locale. */
export const defaultLabels = {
  fr: {
    installedVersionLabel: "Version installée",
    checkButton: "Rechercher une mise à jour",
    upToDate: "Tu as déjà la dernière version.",
    checkError: "Impossible de vérifier les mises à jour.",
    downloadError: "Le téléchargement a échoué.",
    availableTitle: (version: string) => `Version ${version} disponible`,
    installButton: () => "Télécharger et installer",
    installButtonAccessibilityLabel: (version: string) =>
      `Télécharger et installer la version ${version}`,
    downloadingLabel: (percent: number) =>
      `Téléchargement… ${String(percent)}%`,
    downloadingHint:
      "Ton téléphone va ensuite te demander confirmation pour installer la mise à jour.",
    historyTitle: "Historique des versions",
    prereleaseLabel: "Recevoir les versions de test",
    prereleaseDescription:
      "Versions alpha et bêta, avant leur sortie : elles peuvent contenir des bugs.",
  },
  en: {
    installedVersionLabel: "Installed version",
    checkButton: "Check for updates",
    upToDate: "You already have the latest version.",
    checkError: "Couldn't check for updates.",
    downloadError: "The download failed.",
    availableTitle: (version: string) => `Version ${version} available`,
    installButton: () => "Download and install",
    installButtonAccessibilityLabel: (version: string) =>
      `Download and install version ${version}`,
    downloadingLabel: (percent: number) => `Downloading… ${String(percent)}%`,
    downloadingHint: "Your phone will then ask you to confirm the install.",
    historyTitle: "Version history",
    prereleaseLabel: "Get test versions",
    prereleaseDescription:
      "Alpha and beta versions, before their release: they may contain bugs.",
  },
} satisfies Record<KitLocale, Required<UpdateSettingsScreenLabels>>;

type LooseStyleKeys =
  | "activityIndicatorColor"
  | "notes"
  | "prereleaseSwitch"
  | "prereleaseSwitchColors";

/** Default style of each slot of {@link UpdateSettingsScreen}. */
export const defaultStyles: Required<
  Omit<UpdateSettingsScreenStyles, LooseStyleKeys>
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
