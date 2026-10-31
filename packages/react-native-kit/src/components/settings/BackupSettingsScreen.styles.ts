import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

import type { KitLocale } from "../../i18n/locale.js";

/**
 * The optional "backup reminder" switch of {@link BackupSettingsScreen};
 * scheduling the notification is up to the app.
 */
export interface BackupSettingsScreenReminder {
  /** Whether the reminder is on. */
  enabled: boolean;
  /**
   * Set while a permission request or the toggle's own persistence is in
   * flight.
   */
  busy?: boolean;
  /**
   * Called with the new value when the switch is flipped (schedule or cancel
   * the notification, persist the choice).
   */
  onToggle: (value: boolean) => void;
  /**
   * How often the reminder fires, only used to word the hint (e.g. "every 7
   * days").
   */
  intervalDays: number;
}

/** A label / value box shown above the buttons. */
export interface BackupSettingsScreenInfo {
  /** Small caption, e.g. "Last backup". */
  label: string;
  /** The information itself, e.g. a formatted date. */
  value: string;
}

/** Ionicons names of the buttons' leading icons. */
export interface BackupSettingsScreenIcons {
  /** Icon of the export button, e.g. `"share-outline"`. */
  export?: keyof typeof Ionicons.glyphMap;
  /** Icon of the import button, e.g. `"download-outline"`. */
  import?: keyof typeof Ionicons.glyphMap;
}

/**
 * Style overrides of {@link BackupSettingsScreen}, each merged over its
 * default.
 */
export interface BackupSettingsScreenStyles {
  /** The screen's root view. */
  container?: StyleProp<ViewStyle>;
  /** The `info` box. */
  infoBox?: StyleProp<ViewStyle>;
  /** Its caption. */
  infoLabel?: StyleProp<TextStyle>;
  /** Its value. */
  infoValue?: StyleProp<TextStyle>;
  /** Titles of the export and import sections (`layout="sections"`). */
  sectionTitle?: StyleProp<TextStyle>;
  /** Explanatory texts (shared hint, or each section's help text). */
  hint?: StyleProp<TextStyle>;
  /** Row holding both buttons side by side (`layout="compact"`). */
  row?: StyleProp<ViewStyle>;
  /** Both buttons. */
  button?: StyleProp<ViewStyle>;
  /** Added to a button while its action runs. */
  buttonDisabled?: StyleProp<ViewStyle>;
  /** Both buttons' labels. */
  buttonText?: StyleProp<TextStyle>;
  /**
   * Not a style: color of the buttons' icons. Defaults to {@link
   * defaultIconColor}.
   */
  iconColor?: string;
  /**
   * Merged on top of `button`/`buttonText` — defaults to the same look as the
   * export button.
   */
  importButton?: StyleProp<ViewStyle>;
  /** Merged on top of `buttonText` for the import button. */
  importButtonText?: StyleProp<TextStyle>;
  /** Row of the reminder switch. */
  reminderRow?: StyleProp<ViewStyle>;
  /** Column holding the reminder's label and hint, left of the switch. */
  reminderTextColumn?: StyleProp<ViewStyle>;
  /** The reminder's label. */
  reminderLabel?: StyleProp<TextStyle>;
  /** The reminder's hint (its frequency). */
  reminderHint?: StyleProp<TextStyle>;
  /**
   * Not a style: color of the spinner shown in a button while its action runs.
   */
  activityIndicatorColor?: string;
}

/** Text overrides of {@link BackupSettingsScreen}, whatever the `locale`. */
export interface BackupSettingsScreenLabels {
  /**
   * Shared explanation of `layout="compact"` (data lives on this device only,
   * export it regularly).
   */
  hint?: string;
  /** Label of the export button. Default: "⬆️ Exporter" / "⬆️ Export". */
  exportButton?: string;
  /** Label of the import button. Default: "⬇️ Importer" / "⬇️ Import". */
  importButton?: string;
  /** Only shown in `layout="sections"`. */
  exportSectionTitle?: string;
  /** Help text of the export section (`layout="sections"`). */
  exportHelpText?: string;
  /** Title of the import section (`layout="sections"`). */
  importSectionTitle?: string;
  /**
   * Help text of the import section (`layout="sections"`): the import replaces
   * everything.
   */
  importHelpText?: string;
  /** Title of the confirmation shown before `onImport`. */
  importConfirmTitle?: string;
  /** Message of that confirmation (current data will be replaced). */
  importConfirmMessage?: string;
  /** Its confirm button. Default: "Choisir un fichier" / "Choose a file". */
  importConfirmLabel?: string;
  /** Its cancel button. */
  importConfirmCancelLabel?: string;
  /** Label of the reminder switch. */
  reminderLabel?: string;
  /** Hint under the reminder switch, from its `intervalDays`. */
  reminderHint?: (intervalDays: number) => string;
  /** Title of the alert when `onExport` throws (the message is the error's). */
  exportErrorTitle?: string;
  /** Title of the alert when `onImport` throws (the message is the error's). */
  importErrorTitle?: string;
  /** Message of those alerts when the thrown value isn't an `Error`. */
  genericErrorMessage?: string;
}

/** Built-in texts of {@link BackupSettingsScreen}, per locale. */
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

/** Default style of each slot of {@link BackupSettingsScreen}. */
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

/** Default color of the buttons' icons (blue). */
export const defaultIconColor = "#2563eb";
