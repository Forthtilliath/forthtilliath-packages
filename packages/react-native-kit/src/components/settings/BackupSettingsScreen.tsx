import { useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";

import { confirmDestructive } from "../../utils/helpers/confirmDestructive.js";

export interface BackupSettingsScreenReminder {
  enabled: boolean;
  /** Set while a permission request or the toggle's own persistence is in flight. */
  busy?: boolean;
  onToggle: (value: boolean) => void;
  /** How often the reminder fires, only used to word the hint (e.g. "every 7 days"). */
  intervalDays: number;
}

export interface BackupSettingsScreenStyles {
  container?: StyleProp<ViewStyle>;
  hint?: StyleProp<TextStyle>;
  row?: StyleProp<ViewStyle>;
  button?: StyleProp<ViewStyle>;
  buttonDisabled?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
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

export interface BackupSettingsScreenProps {
  /** Exports/shares the app's data however it sees fit (e.g. a JSON file via the native share sheet). */
  onExport: () => Promise<void>;
  /**
   * Imports data from a file the user picks, replacing what's currently
   * stored. Only called after the user confirms the destructive-replace
   * warning — this doesn't need to show its own confirmation.
   */
  onImport: () => Promise<void>;
  /** Omit entirely to not show a reminder toggle at all. */
  reminder?: BackupSettingsScreenReminder;
  labels?: BackupSettingsScreenLabels;
  styles?: BackupSettingsScreenStyles;
}

const defaultLabels: Required<
  Omit<BackupSettingsScreenLabels, "reminderHint">
> &
  Pick<BackupSettingsScreenLabels, "reminderHint"> = {
  hint: "Les données sont stockées uniquement sur cet appareil et sont perdues en cas de réinstallation ou de mise à jour incompatible. Exporte-les régulièrement pour pouvoir les restaurer.",
  exportButton: "⬆️ Exporter",
  importButton: "⬇️ Importer",
  importConfirmTitle: "Importer une sauvegarde ?",
  importConfirmMessage:
    "Toutes les données actuelles seront remplacées par celles du fichier choisi.",
  importConfirmLabel: "Choisir un fichier",
  importConfirmCancelLabel: "Annuler",
  reminderLabel: "🔔 Rappel de sauvegarde",
  reminderHint: undefined,
  exportErrorTitle: "Échec de l'export",
  importErrorTitle: "Échec de l'import",
  genericErrorMessage: "Une erreur inconnue s'est produite.",
};

const defaultStyles: Required<
  Omit<BackupSettingsScreenStyles, "activityIndicatorColor">
> &
  Pick<BackupSettingsScreenStyles, "activityIndicatorColor"> = {
  container: {},
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  row: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#2563eb", fontWeight: "700" },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },
  reminderTextColumn: { flex: 1 },
  reminderLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  reminderHint: { fontSize: 13, color: "#6b7280" },
  activityIndicatorColor: undefined,
};

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

// Export/import buttons plus an optional reminder-notification toggle — the
// standard "Backup" section of a settings tab. Deliberately just a shell:
// what gets exported/imported is entirely app-specific (its own database
// tables), so `onExport`/`onImport` are required props, not something this
// package could have a sensible default for.
export function BackupSettingsScreen({
  onExport,
  onImport,
  reminder,
  labels,
  styles,
}: BackupSettingsScreenProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const merged = {
    container: [defaultStyles.container, styles?.container],
    hint: [defaultStyles.hint, styles?.hint],
    row: [defaultStyles.row, styles?.row],
    button: [defaultStyles.button, styles?.button],
    buttonDisabled: [defaultStyles.buttonDisabled, styles?.buttonDisabled],
    buttonText: [defaultStyles.buttonText, styles?.buttonText],
    reminderRow: [defaultStyles.reminderRow, styles?.reminderRow],
    reminderTextColumn: [
      defaultStyles.reminderTextColumn,
      styles?.reminderTextColumn,
    ],
    reminderLabel: [defaultStyles.reminderLabel, styles?.reminderLabel],
    reminderHint: [defaultStyles.reminderHint, styles?.reminderHint],
  };
  const t = { ...defaultLabels, ...labels };
  const activityIndicatorColor =
    styles?.activityIndicatorColor ?? defaultStyles.activityIndicatorColor;

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    try {
      await onExport();
    } catch (err) {
      Alert.alert(t.exportErrorTitle, errorMessage(err, t.genericErrorMessage));
    } finally {
      setExporting(false);
    }
  }

  function handleImportPress() {
    if (importing) return;
    confirmDestructive(
      t.importConfirmTitle,
      () => {
        void (async () => {
          setImporting(true);
          try {
            await onImport();
          } catch (err) {
            Alert.alert(
              t.importErrorTitle,
              errorMessage(err, t.genericErrorMessage),
            );
          } finally {
            setImporting(false);
          }
        })();
      },
      {
        message: t.importConfirmMessage,
        cancelLabel: t.importConfirmCancelLabel,
        confirmLabel: t.importConfirmLabel,
      },
    );
  }

  return (
    <View style={merged.container}>
      <Text style={merged.hint}>{t.hint}</Text>

      <View style={merged.row}>
        <Pressable
          style={[merged.button, exporting && merged.buttonDisabled]}
          disabled={exporting}
          onPress={() => {
            void handleExport();
          }}
          accessibilityRole="button"
          accessibilityLabel={t.exportButton}
        >
          {exporting ? (
            <ActivityIndicator color={activityIndicatorColor} />
          ) : (
            <Text style={merged.buttonText}>{t.exportButton}</Text>
          )}
        </Pressable>
        <Pressable
          style={[merged.button, importing && merged.buttonDisabled]}
          disabled={importing}
          onPress={handleImportPress}
          accessibilityRole="button"
          accessibilityLabel={t.importButton}
        >
          {importing ? (
            <ActivityIndicator color={activityIndicatorColor} />
          ) : (
            <Text style={merged.buttonText}>{t.importButton}</Text>
          )}
        </Pressable>
      </View>

      {reminder && (
        <Pressable
          style={merged.reminderRow}
          disabled={reminder.busy}
          onPress={() => {
            reminder.onToggle(!reminder.enabled);
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: reminder.enabled }}
          accessibilityLabel={t.reminderLabel}
        >
          <View style={merged.reminderTextColumn}>
            <Text style={merged.reminderLabel}>{t.reminderLabel}</Text>
            <Text style={merged.reminderHint}>
              {t.reminderHint?.(reminder.intervalDays) ??
                `Une notification tous les ${String(reminder.intervalDays)} jours pour penser à exporter.`}
            </Text>
          </View>
          {reminder.busy ? (
            <ActivityIndicator color={activityIndicatorColor} />
          ) : (
            <Switch
              value={reminder.enabled}
              onValueChange={reminder.onToggle}
            />
          )}
        </Pressable>
      )}
    </View>
  );
}
