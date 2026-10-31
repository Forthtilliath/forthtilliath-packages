import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import type { ChangelogNotesStyles } from "@forthtilliath/expo-release-updates-ui";
import { ChangelogNotes } from "@forthtilliath/expo-release-updates-ui";

import type { UpdateSettingsScreenHistoryEntry } from "./UpdateSettingsScreen.styles.js";

/**
 * Merged styles of the version history (see {@link
 * UpdateSettingsScreenStyles}).
 * @internal
 */
export interface UpdateSettingsScreenHistoryStyles {
  /** The section. */
  changelog: StyleProp<ViewStyle>;
  /** Its title. */
  changelogTitle: StyleProp<TextStyle>;
  /** Each release. */
  changelogEntry: StyleProp<ViewStyle>;
  /** Row of a release's version and date. */
  changelogEntryHeader: StyleProp<ViewStyle>;
  /** A release's version. */
  changelogVersion: StyleProp<TextStyle>;
  /** A release's date. */
  changelogDate: StyleProp<TextStyle>;
}

/**
 * Props of {@link UpdateSettingsScreenHistory}.
 * @internal
 */
export interface UpdateSettingsScreenHistoryProps {
  /** The past releases, most recent first. */
  releaseHistory: UpdateSettingsScreenHistoryEntry[];
  /** Title of the section. */
  historyTitle: string;
  /** Locale of the dates. */
  dateLocale: string;
  /** Styles of the release notes. */
  notesStyles: ChangelogNotesStyles;
  /** Merged styles of the section. */
  styles: UpdateSettingsScreenHistoryStyles;
}

/**
 * Past-releases list shown below the "check for update" box, one entry per
 * release (version, publish date, changelog). Extracted from
 * UpdateSettingsScreen to keep that file under the project's
 * 300-line-per-file rule.
 * @internal
 */
export function UpdateSettingsScreenHistory({
  releaseHistory,
  historyTitle,
  dateLocale,
  notesStyles,
  styles,
}: UpdateSettingsScreenHistoryProps) {
  return (
    <View style={styles.changelog}>
      <Text style={styles.changelogTitle}>{historyTitle}</Text>
      {releaseHistory.map((release) => (
        <View key={release.version} style={styles.changelogEntry}>
          <View style={styles.changelogEntryHeader}>
            <Text style={styles.changelogVersion}>v{release.version}</Text>
            {release.publishedAt ? (
              <Text style={styles.changelogDate}>
                {new Date(release.publishedAt).toLocaleDateString(dateLocale)}
              </Text>
            ) : null}
          </View>
          {release.notes ? (
            <ChangelogNotes notes={release.notes} styles={notesStyles} />
          ) : null}
        </View>
      ))}
    </View>
  );
}
