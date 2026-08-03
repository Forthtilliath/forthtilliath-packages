import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { ChangelogNotesStyles } from "./ChangelogNotes.js";
import { ChangelogNotes } from "./ChangelogNotes.js";

export interface UpdateAvailableBannerStyles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  notes?: ChangelogNotesStyles;
  actionButton?: StyleProp<ViewStyle>;
  actionButtonText?: StyleProp<TextStyle>;
  dismissButton?: StyleProp<ViewStyle>;
  dismissButtonText?: StyleProp<TextStyle>;
}

export interface UpdateAvailableBannerLabels {
  title?: (version: string) => string;
  action?: string;
  dismiss?: string;
  dismissAccessibilityLabel?: string;
}

export interface UpdateAvailableBannerProps {
  version: string;
  /** Raw release notes, passed straight to `ChangelogNotes`. */
  notes: string;
  onPress: () => void;
  onDismiss: () => void;
  labels?: UpdateAvailableBannerLabels;
  styles?: UpdateAvailableBannerStyles;
}

const defaultStyles: Required<UpdateAvailableBannerStyles> = {
  container: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 15, fontWeight: "700", color: "#111827" },
  notes: {},
  actionButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
  dismissButton: { padding: 4 },
  dismissButtonText: { fontSize: 13, color: "#6b7280" },
};

const defaultLabels: Required<UpdateAvailableBannerLabels> = {
  title: (version) => `Version ${version} disponible`,
  action: "Voir",
  dismiss: "Fermer",
  dismissAccessibilityLabel: "Fermer la notification de mise à jour",
};

// Dismissible banner announcing an available update: version, release notes
// (via `ChangelogNotes`), and an action + dismiss button. Has no opinion on
// what "action" does (e.g. navigate to an update screen) or on how/whether
// dismissal is persisted — both are left entirely to the caller.
export function UpdateAvailableBanner({
  version,
  notes,
  onPress,
  onDismiss,
  labels,
  styles,
}: UpdateAvailableBannerProps) {
  // Style fields are merged as arrays (default, then override) so a partial
  // override only changes the properties it specifies instead of replacing
  // the whole default style object. `notes` is forwarded as-is to
  // ChangelogNotes, which does its own equivalent merge against its defaults.
  const merged = {
    container: [defaultStyles.container, styles?.container],
    header: [defaultStyles.header, styles?.header],
    title: [defaultStyles.title, styles?.title],
    notes: styles?.notes ?? defaultStyles.notes,
    actionButton: [defaultStyles.actionButton, styles?.actionButton],
    actionButtonText: [
      defaultStyles.actionButtonText,
      styles?.actionButtonText,
    ],
    dismissButton: [defaultStyles.dismissButton, styles?.dismissButton],
    dismissButtonText: [
      defaultStyles.dismissButtonText,
      styles?.dismissButtonText,
    ],
  };
  const t = { ...defaultLabels, ...labels };

  return (
    <View style={merged.container}>
      <View style={merged.header}>
        <Text style={merged.title}>{t.title(version)}</Text>
        <Pressable
          style={merged.dismissButton}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t.dismissAccessibilityLabel}
        >
          <Text style={merged.dismissButtonText}>{t.dismiss}</Text>
        </Pressable>
      </View>
      {notes ? <ChangelogNotes notes={notes} styles={merged.notes} /> : null}
      <Pressable
        style={merged.actionButton}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t.action}
      >
        <Text style={merged.actionButtonText}>{t.action}</Text>
      </Pressable>
    </View>
  );
}
