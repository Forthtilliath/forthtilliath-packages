import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import type { ChangelogNotesStyles } from "@forthtilliath/expo-release-updates-ui";
import { ChangelogNotes } from "@forthtilliath/expo-release-updates-ui";

import type { UpdateSettingsScreenHistoryEntry } from "./UpdateSettingsScreen.styles.js";

export interface UpdateSettingsScreenHistoryStyles {
  changelog: StyleProp<ViewStyle>;
  changelogTitle: StyleProp<TextStyle>;
  changelogEntry: StyleProp<ViewStyle>;
  changelogEntryHeader: StyleProp<ViewStyle>;
  changelogVersion: StyleProp<TextStyle>;
  changelogDate: StyleProp<TextStyle>;
}

export interface UpdateSettingsScreenHistoryProps {
  releaseHistory: UpdateSettingsScreenHistoryEntry[];
  historyTitle: string;
  dateLocale: string;
  notesStyles: ChangelogNotesStyles;
  styles: UpdateSettingsScreenHistoryStyles;
}

// Past-releases list shown below the "check for update" box, one entry per
// release (version, publish date, changelog). Extracted from
// UpdateSettingsScreen to keep that file under the project's
// 300-line-per-file rule.
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
