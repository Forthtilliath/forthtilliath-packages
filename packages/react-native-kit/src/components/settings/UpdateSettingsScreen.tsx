import { useCallback, useEffect, useMemo, useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { ChangelogNotesStyles } from "../update/ChangelogNotes.js";
import { ChangelogNotes } from "../update/ChangelogNotes.js";

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

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "up-to-date" }
  | { status: "available"; release: UpdateSettingsScreenRelease }
  | { status: "downloading"; progress: number }
  | { status: "error"; message: string };

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

export interface UpdateSettingsScreenProps {
  currentVersion: string;
  /** Fetches the latest available release, or `null` if there is none. */
  checkForUpdate: () => Promise<UpdateSettingsScreenRelease | null>;
  /** Positive when `a` is newer than `b`, e.g. semver comparison. */
  compareVersions: (a: string, b: string) => number;
  downloadAndInstallApk: (
    apkUrl: string,
    onProgress?: (fraction: number) => void,
  ) => Promise<void>;
  /** Omit to not show a version history section at all. */
  fetchReleaseHistory?: () => Promise<UpdateSettingsScreenHistoryEntry[]>;
  /** Locale for formatting each history entry's date. Defaults to `"fr-FR"`. */
  dateLocale?: string;
  labels?: UpdateSettingsScreenLabels;
  styles?: UpdateSettingsScreenStyles;
}

const defaultLabels: Required<UpdateSettingsScreenLabels> = {
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

const defaultStyles: Required<
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

// Full "check for update" screen: installed version, a manual check button,
// the available-update box (with changelog + install button) or an
// up-to-date/error message, download progress, and — if
// `fetchReleaseHistory` is passed — a list of past releases. Checks
// automatically once on mount (the caller decided to navigate here, no need
// to make them tap "check" again).
export function UpdateSettingsScreen({
  currentVersion,
  checkForUpdate,
  compareVersions,
  downloadAndInstallApk,
  fetchReleaseHistory,
  dateLocale = "fr-FR",
  labels,
  styles,
}: UpdateSettingsScreenProps) {
  const merged = {
    container: [defaultStyles.container, styles?.container],
    infoBox: [defaultStyles.infoBox, styles?.infoBox],
    infoLabel: [defaultStyles.infoLabel, styles?.infoLabel],
    infoValue: [defaultStyles.infoValue, styles?.infoValue],
    helpText: [defaultStyles.helpText, styles?.helpText],
    errorText: [defaultStyles.errorText, styles?.errorText],
    button: [defaultStyles.button, styles?.button],
    buttonDisabled: [defaultStyles.buttonDisabled, styles?.buttonDisabled],
    buttonText: [defaultStyles.buttonText, styles?.buttonText],
    updateAvailableBox: [
      defaultStyles.updateAvailableBox,
      styles?.updateAvailableBox,
    ],
    updateAvailableTitle: [
      defaultStyles.updateAvailableTitle,
      styles?.updateAvailableTitle,
    ],
    changelog: [defaultStyles.changelog, styles?.changelog],
    changelogTitle: [defaultStyles.changelogTitle, styles?.changelogTitle],
    changelogEntry: [defaultStyles.changelogEntry, styles?.changelogEntry],
    changelogEntryHeader: [
      defaultStyles.changelogEntryHeader,
      styles?.changelogEntryHeader,
    ],
    changelogVersion: [
      defaultStyles.changelogVersion,
      styles?.changelogVersion,
    ],
    changelogDate: [defaultStyles.changelogDate, styles?.changelogDate],
    notes: styles?.notes ?? defaultStyles.notes,
  };
  const activityIndicatorColor =
    styles?.activityIndicatorColor ?? defaultStyles.activityIndicatorColor;
  const t = { ...defaultLabels, ...labels };

  const [updateState, setUpdateState] = useState<UpdateState>({
    status: "idle",
  });
  const [releaseHistory, setReleaseHistory] = useState<
    UpdateSettingsScreenHistoryEntry[] | null
  >(null);

  useEffect(() => {
    if (!fetchReleaseHistory) return;
    fetchReleaseHistory()
      .then(setReleaseHistory)
      .catch(() => {
        setReleaseHistory([]);
      });
  }, [fetchReleaseHistory]);

  const handleCheckForUpdate = useCallback(async () => {
    setUpdateState({ status: "checking" });
    try {
      const release = await checkForUpdate();
      if (!release || compareVersions(release.version, currentVersion) <= 0) {
        setUpdateState({ status: "up-to-date" });
        return;
      }
      setUpdateState({ status: "available", release });
    } catch {
      setUpdateState({ status: "error", message: t.checkError });
    }
  }, [checkForUpdate, compareVersions, currentVersion, t.checkError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the caller navigated here specifically to check, so this fires a real check on mount rather than waiting for a manual tap; the actual state update happens after the async checkForUpdate() call, not synchronously.
    void handleCheckForUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps, @eslint-react/exhaustive-deps -- runs once on mount by design; handleCheckForUpdate is expected to be stable enough for the screen's lifetime.
  }, []);

  async function handleInstall(apkUrl: string) {
    setUpdateState({ status: "downloading", progress: 0 });
    try {
      await downloadAndInstallApk(apkUrl, (progress) => {
        setUpdateState({ status: "downloading", progress });
      });
      setUpdateState({ status: "idle" });
    } catch {
      setUpdateState({ status: "error", message: t.downloadError });
    }
  }

  const isBusy =
    updateState.status === "checking" || updateState.status === "downloading";
  const notesStyles = useMemo(
    () => ({
      heading: merged.updateAvailableTitle,
      text: merged.helpText,
      ...merged.notes,
    }),
    [merged.helpText, merged.notes, merged.updateAvailableTitle],
  );

  return (
    <View style={merged.container}>
      <View style={merged.infoBox}>
        <Text style={merged.infoLabel}>{t.installedVersionLabel}</Text>
        <Text style={merged.infoValue}>{currentVersion}</Text>
      </View>

      {updateState.status !== "available" &&
        updateState.status !== "downloading" && (
          <Pressable
            style={[merged.button, isBusy && merged.buttonDisabled]}
            onPress={() => {
              void handleCheckForUpdate();
            }}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel={t.checkButton}
          >
            {updateState.status === "checking" ? (
              <ActivityIndicator color={activityIndicatorColor} />
            ) : (
              <Text style={merged.buttonText}>{t.checkButton}</Text>
            )}
          </Pressable>
        )}

      {updateState.status === "up-to-date" && (
        <Text style={merged.helpText}>{t.upToDate}</Text>
      )}

      {updateState.status === "error" && (
        <Text style={merged.errorText}>{updateState.message}</Text>
      )}

      {updateState.status === "available" && (
        <View style={merged.updateAvailableBox}>
          <Text style={merged.updateAvailableTitle}>
            {t.availableTitle(updateState.release.version)}
          </Text>
          {updateState.release.notes ? (
            <ChangelogNotes
              notes={updateState.release.notes}
              styles={merged.notes}
            />
          ) : null}
          <Pressable
            style={merged.button}
            onPress={() => {
              void handleInstall(updateState.release.apkUrl);
            }}
            accessibilityRole="button"
            accessibilityLabel={t.installButtonAccessibilityLabel(
              updateState.release.version,
            )}
          >
            <Text style={merged.buttonText}>
              {t.installButton(updateState.release.version)}
            </Text>
          </Pressable>
        </View>
      )}

      {updateState.status === "downloading" && (
        <View style={merged.updateAvailableBox}>
          <Text style={merged.helpText}>
            {t.downloadingLabel(Math.round(updateState.progress * 100))}
          </Text>
          <Text style={merged.helpText}>{t.downloadingHint}</Text>
        </View>
      )}

      {releaseHistory && releaseHistory.length > 0 && (
        <View style={merged.changelog}>
          <Text style={merged.changelogTitle}>{t.historyTitle}</Text>
          {releaseHistory.map((release) => (
            <View key={release.version} style={merged.changelogEntry}>
              <View style={merged.changelogEntryHeader}>
                <Text style={merged.changelogVersion}>v{release.version}</Text>
                {release.publishedAt ? (
                  <Text style={merged.changelogDate}>
                    {new Date(release.publishedAt).toLocaleDateString(
                      dateLocale,
                    )}
                  </Text>
                ) : null}
              </View>
              {release.notes ? (
                <ChangelogNotes notes={release.notes} styles={notesStyles} />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
