import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ChangelogNotes } from "@forthtilliath/expo-release-updates-ui";

import type {
  UpdateSettingsScreenHistoryEntry,
  UpdateSettingsScreenLabels,
  UpdateSettingsScreenRelease,
  UpdateSettingsScreenStyles,
} from "./UpdateSettingsScreen.styles.js";
import { defaultLabels, defaultStyles } from "./UpdateSettingsScreen.styles.js";
import { UpdateSettingsScreenHistory } from "./UpdateSettingsScreenHistory.js";

export type {
  UpdateSettingsScreenHistoryEntry,
  UpdateSettingsScreenLabels,
  UpdateSettingsScreenRelease,
  UpdateSettingsScreenStyles,
} from "./UpdateSettingsScreen.styles.js";

type UpdateState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "up-to-date" }
  | { status: "available"; release: UpdateSettingsScreenRelease }
  | { status: "downloading"; progress: number }
  | { status: "error"; message: string };

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
    void handleCheckForUpdate();
    // eslint-disable-next-line @eslint-react/exhaustive-deps -- runs once on mount by design; handleCheckForUpdate is expected to be stable enough for the screen's lifetime.
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
        <UpdateSettingsScreenHistory
          releaseHistory={releaseHistory}
          historyTitle={t.historyTitle}
          dateLocale={dateLocale}
          notesStyles={notesStyles}
          styles={merged}
        />
      )}
    </View>
  );
}
