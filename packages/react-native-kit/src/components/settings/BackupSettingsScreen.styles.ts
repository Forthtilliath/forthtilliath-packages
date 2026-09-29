import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

import type { KitLocale } from "../../i18n/locale.js";

export interface BackupSettingsScreenReminder {
  enabled: boolean;
  /** Set while a permission request or the toggle's own persistence is in flight. */
  busy?: boolean;
  onToggle: (value: boolean) => void;
  /** How often the reminder fires, only used to word the hint (e.g. "every 7 days"). */
  intervalDays: number;
}

export interface BackupSettingsScreenInfo {
  label: string;
  value: string;
}

export interface BackupSettingsScreenIcons {
  export?: keyof typeof Ionicons.glyphMap;
  import?: keyof typeof Ionicons.glyphMap;
}

export interface BackupSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  infoBox?: StyleProp<ViewStyle>;
  infoLabel?: StyleProp<TextStyle>;
  infoValue?: StyleProp<TextStyle>;
  sectionTitle?: StyleProp<TextStyle>;
  hint?: StyleProp<TextStyle>;
  row?: StyleProp<ViewStyle>;
  button?: StyleProp<ViewStyle>;
  buttonDisabled?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
  iconColor?: string;
  /** Merged on top of `button`/`buttonText` — defaults to the same look as the export button. */
  importButton?: StyleProp<ViewStyle>;
  importButtonText?: StyleProp<TextStyle>;
  reminderRow?: StyleProp<ViewStyle>;
  reminderTextColumn?: StyleProp<ViewStyle>;
  reminderLabel?: StyleProp<TextStyle>;
  reminderHint?: StyleProp<TextStyle>;
  activityIndicatorColor?: string;
}

export interface BackupSettingsScreenLabels {
  hint?: string;
  exportButton?: string;
  importButton?: string;
  /** Only shown in `layout="sections"`. */
  exportSectionTitle?: string;
  exportHelpText?: string;
  importSectionTitle?: string;
  importHelpText?: string;
  importConfirmTitle?: string;
  importConfirmMessage?: string;
  importConfirmLabel?: string;
  importConfirmCancelLabel?: string;
  reminderLabel?: string;
  reminderHint?: (intervalDays: number) => string;
  exportErrorTitle?: string;
  importErrorTitle?: string;
  genericErrorMessage?: string;
}

export const defaultLabels = {
  fr: {
    hint: "Les données sont stockées uniquement sur cet appareil et sont perdues en cas de réinstallation ou de mise à jour incompatible. Exporte-les régulièrement pour pouvoir les restaurer.",
    exportButton: "⬆️ Exporter",
    importButton: "⬇️ Importer",
    exportSectionTitle: "Exporter",
    exportHelpText:
      "Exporte toutes tes données dans un fichier que tu peux garder précieusement ou transférer vers un autre appareil.",
    importSectionTitle: "Importer",
    importHelpText:
      "Restaure une sauvegarde exportée précédemment. Remplace entièrement les données actuelles — il n'y a pas de fusion.",
    importConfirmTitle: "Importer une sauvegarde ?",
    importConfirmMessage:
      "Toutes les données actuelles seront remplacées par celles du fichier choisi.",
    importConfirmLabel: "Choisir un fichier",
    importConfirmCancelLabel: "Annuler",
    reminderLabel: "🔔 Rappel de sauvegarde",
    reminderHint: (intervalDays: number) =>
      `Une notification tous les ${String(intervalDays)} jours pour penser à exporter.`,
    exportErrorTitle: "Échec de l'export",
    importErrorTitle: "Échec de l'import",
    genericErrorMessage: "Une erreur inconnue s'est produite.",
  },
  en: {
    hint: "Your data is only stored on this device and is lost if the app is reinstalled or an update is incompatible. Export it regularly so you can restore it.",
    exportButton: "⬆️ Export",
    importButton: "⬇️ Import",
    exportSectionTitle: "Export",
    exportHelpText:
      "Exports all your data to a file you can keep safe or move to another device.",
    importSectionTitle: "Import",
    importHelpText:
      "Restores a previously exported backup. It fully replaces the current data — nothing is merged.",
    importConfirmTitle: "Import a backup?",
    importConfirmMessage:
      "All current data will be replaced by the chosen file's.",
    importConfirmLabel: "Choose a file",
    importConfirmCancelLabel: "Cancel",
    reminderLabel: "🔔 Backup reminder",
    reminderHint: (intervalDays: number) =>
      `A notification every ${String(intervalDays)} days as a reminder to export.`,
    exportErrorTitle: "Export failed",
    importErrorTitle: "Import failed",
    genericErrorMessage: "An unknown error occurred.",
  },
} satisfies Record<KitLocale, Required<BackupSettingsScreenLabels>>;

export const defaultStyles = {
  container: {} satisfies ViewStyle,
  infoBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 2,
  } satisfies ViewStyle,
  infoLabel: { fontSize: 12, color: "#6b7280" } satisfies TextStyle,
  infoValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
  } satisfies TextStyle,
  hint: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 18,
  } satisfies TextStyle,
  row: { flexDirection: "row", gap: 10 } satisfies ViewStyle,
  button: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  } satisfies ViewStyle,
  buttonDisabled: { opacity: 0.5 } satisfies ViewStyle,
  buttonText: { color: "#2563eb", fontWeight: "700" } satisfies TextStyle,
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  } satisfies ViewStyle,
  reminderTextColumn: { flex: 1 } satisfies ViewStyle,
  reminderLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  } satisfies TextStyle,
  reminderHint: { fontSize: 13, color: "#6b7280" } satisfies TextStyle,
};

export const defaultIconColor = "#2563eb";
