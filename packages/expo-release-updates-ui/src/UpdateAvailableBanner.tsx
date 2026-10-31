import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import type { ChangelogNotesStyles } from "./ChangelogNotes.js";
import { ChangelogNotes } from "./ChangelogNotes.js";

/**
 * Style overrides of {@link UpdateAvailableBanner}, each merged over its
 * default (white card, blue action button).
 */
export interface UpdateAvailableBannerStyles {
  /** The card around everything. */
  container?: StyleProp<ViewStyle>;
  /** The row holding the title and the dismiss button. */
  header?: StyleProp<ViewStyle>;
  /** The "Version X available" title. */
  title?: StyleProp<TextStyle>;
  /** Styles of the release notes, forwarded to {@link ChangelogNotes}. */
  notes?: ChangelogNotesStyles;
  /** The full-width action button. */
  actionButton?: StyleProp<ViewStyle>;
  /** Its label. */
  actionButtonText?: StyleProp<TextStyle>;
  /** The small dismiss button of the header. */
  dismissButton?: StyleProp<ViewStyle>;
  /** Its label. */
  dismissButtonText?: StyleProp<TextStyle>;
}

/** Languages the banner's built-in labels are available in. */
export type UpdateBannerLocale = "fr" | "en";

/** Text overrides of {@link UpdateAvailableBanner}, whatever the `locale`. */
export interface UpdateAvailableBannerLabels {
  /**
   * Builds the title from the version. Default: "Version {version} disponible"
   * / "Version {version} available".
   */
  title?: (version: string) => string;
  /**
   * Label of the action button. Default: "Voir" / "View" ({@link
   * UpdateNotifier} uses "Installer" / "Install").
   */
  action?: string;
  /** Label of the dismiss button. Default: "Fermer" / "Close". */
  dismiss?: string;
  /**
   * What TalkBack reads on the dismiss button. Default: "Fermer la notification
   * de mise à jour" / "Dismiss the update notification".
   */
  dismissAccessibilityLabel?: string;
}

/** Props of {@link UpdateAvailableBanner}. */
export interface UpdateAvailableBannerProps {
  /** The available version, shown in the title. */
  version: string;
  /** Raw release notes, passed straight to `ChangelogNotes`. */
  notes: string;
  /** Called when the action button is pressed. */
  onPress: () => void;
  /**
   * Called when the dismiss button is pressed; hiding the banner (and
   * remembering it) is up to the caller.
   */
  onDismiss: () => void;
  /** Overrides individual built-in labels, whatever the `locale`. */
  labels?: UpdateAvailableBannerLabels;
  /**
   * Language of the built-in labels.
   * @defaultValue "fr"
   */
  locale?: UpdateBannerLocale;
  /** Style overrides, merged over the defaults. */
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

const defaultLabels: Record<
  UpdateBannerLocale,
  Required<UpdateAvailableBannerLabels>
> = {
  fr: {
    title: (version) => `Version ${version} disponible`,
    action: "Voir",
    dismiss: "Fermer",
    dismissAccessibilityLabel: "Fermer la notification de mise à jour",
  },
  en: {
    title: (version) => `Version ${version} available`,
    action: "View",
    dismiss: "Close",
    dismissAccessibilityLabel: "Dismiss the update notification",
  },
};

/**
 * Dismissible banner announcing an available update: a title with the
 * version, the release notes (via {@link ChangelogNotes}), an action button and
 * a dismiss button. It has no opinion on what the action does (open an update
 * screen, start the download…) nor on whether dismissal is persisted: both
 * are up to the caller. {@link UpdateNotifier} wires it for the usual flow.
 *
 * Every style field is merged over its default, so a partial override only
 * changes what it specifies.
 *
 * @example
 * <UpdateAvailableBanner
 *   version={release.version}
 *   notes={release.notes}
 *   onPress={() => router.push("/settings/update")}
 *   onDismiss={() => setHidden(true)}
 *   styles={{ container: { backgroundColor: colors.card } }}
 * />
 */
export function UpdateAvailableBanner({
  version,
  notes,
  onPress,
  onDismiss,
  labels,
  locale = "fr",
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
  const t = { ...defaultLabels[locale], ...labels };

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
