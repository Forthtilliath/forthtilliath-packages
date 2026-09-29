import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useSubmitGuard } from "../../hooks/useSubmitGuard.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { confirmDestructive } from "../../utils/helpers/confirmDestructive.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

import {
  type BackupSettingsScreenIcons,
  type BackupSettingsScreenInfo,
  type BackupSettingsScreenLabels,
  type BackupSettingsScreenReminder,
  type BackupSettingsScreenStyles,
  defaultIconColor,
  defaultLabels,
  defaultStyles,
} from "./BackupSettingsScreen.styles.js";

export type {
  BackupSettingsScreenIcons,
  BackupSettingsScreenInfo,
  BackupSettingsScreenLabels,
  BackupSettingsScreenReminder,
  BackupSettingsScreenStyles,
} from "./BackupSettingsScreen.styles.js";

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
  /** An info box above everything else, e.g. "Last auto-backup: ...". Omit to not show one. */
  info?: BackupSettingsScreenInfo;
  /**
   * `"compact"` (default): one shared hint, both buttons side by side.
   * `"sections"`: each action gets its own title + help text, buttons
   * stacked full-width.
   */
  layout?: "compact" | "sections";
  /** Leading icon for each button. Omit either (or both) for a text-only button (default). */
  icons?: BackupSettingsScreenIcons;
  labels?: BackupSettingsScreenLabels;
  /**
   * Language of the built-in labels — French by default, or the nearest
   * `KitLocaleProvider`'s. `labels` still overrides individual strings.
   */
  locale?: KitLocale;
  styles?: BackupSettingsScreenStyles;
}

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
  info,
  layout = "compact",
  icons,
  labels,
  locale,
  styles,
}: BackupSettingsScreenProps) {
  // Guards rather than a plain `if (busy) return`: two taps before the
  // re-render would both see the stale "not busy" state and run twice.
  const exportGuard = useSubmitGuard();
  const importGuard = useSubmitGuard();
  const merged = mergeSlotStyles(defaultStyles, styles);
  const importButtonStyle = [merged.button, styles?.importButton];
  const importButtonTextStyle = [merged.buttonText, styles?.importButtonText];
  const t = { ...defaultLabels[useKitLocale(locale)], ...labels };
  const activityIndicatorColor = styles?.activityIndicatorColor;
  const iconColor = styles?.iconColor ?? defaultIconColor;

  function handleExport() {
    void exportGuard.guard(async () => {
      try {
        await onExport();
      } catch (err) {
        Alert.alert(
          t.exportErrorTitle,
          errorMessage(err, t.genericErrorMessage),
        );
      }
    });
  }

  function handleImportPress() {
    if (importGuard.isSaving) return;
    confirmDestructive(
      t.importConfirmTitle,
      () => {
        void importGuard.guard(async () => {
          try {
            await onImport();
          } catch (err) {
            Alert.alert(
              t.importErrorTitle,
              errorMessage(err, t.genericErrorMessage),
            );
          }
        });
      },
      {
        message: t.importConfirmMessage,
        cancelLabel: t.importConfirmCancelLabel,
        confirmLabel: t.importConfirmLabel,
      },
    );
  }

  const exporting = exportGuard.isSaving;
  const importing = importGuard.isSaving;

  const exportButton = (
    <Pressable
      style={[merged.button, exporting && merged.buttonDisabled]}
      disabled={exporting}
      onPress={handleExport}
      accessibilityRole="button"
      accessibilityLabel={t.exportButton}
    >
      {exporting ? (
        <ActivityIndicator color={activityIndicatorColor} />
      ) : (
        <>
          {icons?.export && (
            <Ionicons name={icons.export} size={18} color={iconColor} />
          )}
          <Text style={merged.buttonText}>{t.exportButton}</Text>
        </>
      )}
    </Pressable>
  );

  const importButton = (
    <Pressable
      style={[importButtonStyle, importing && merged.buttonDisabled]}
      disabled={importing}
      onPress={handleImportPress}
      accessibilityRole="button"
      accessibilityLabel={t.importButton}
    >
      {importing ? (
        <ActivityIndicator color={activityIndicatorColor} />
      ) : (
        <>
          {icons?.import && (
            <Ionicons name={icons.import} size={18} color={iconColor} />
          )}
          <Text style={importButtonTextStyle}>{t.importButton}</Text>
        </>
      )}
    </Pressable>
  );

  return (
    <View style={merged.container}>
      {info && (
        <View style={merged.infoBox}>
          <Text style={merged.infoLabel}>{info.label}</Text>
          <Text style={merged.infoValue}>{info.value}</Text>
        </View>
      )}

      {layout === "sections" ? (
        <>
          <Text style={merged.sectionTitle}>{t.exportSectionTitle}</Text>
          <Text style={merged.hint}>{t.exportHelpText}</Text>
          {exportButton}

          <Text style={merged.sectionTitle}>{t.importSectionTitle}</Text>
          <Text style={merged.hint}>{t.importHelpText}</Text>
          {importButton}
        </>
      ) : (
        <>
          <Text style={merged.hint}>{t.hint}</Text>
          <View style={merged.row}>
            {exportButton}
            {importButton}
          </View>
        </>
      )}

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
              {t.reminderHint(reminder.intervalDays)}
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
