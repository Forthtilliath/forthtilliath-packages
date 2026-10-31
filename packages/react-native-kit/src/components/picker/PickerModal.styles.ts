import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import type { KitLocale } from "../../i18n/locale.js";

/** Style overrides of {@link PickerModal}, each merged over its default. */
export interface PickerModalStyles {
  /** The full-screen modal's root view. */
  container?: StyleProp<ViewStyle>;
  /** Row holding the title and the close button. */
  header?: StyleProp<ViewStyle>;
  /** The title. */
  title?: StyleProp<TextStyle>;
  /** The close button's text. */
  close?: StyleProp<TextStyle>;
  /** Row holding the search field and the voice search button. */
  searchRow?: StyleProp<ViewStyle>;
  /** The search field. */
  search?: StyleProp<TextStyle>;
  /** Each result. */
  row?: StyleProp<ViewStyle>;
  /** A result's photo. */
  rowThumbnail?: StyleProp<ImageStyle>;
  /** The icon box shown for a result with `imageUri: null`. */
  rowThumbnailPlaceholder?: StyleProp<ViewStyle>;
  /** A result's label. */
  rowLabel?: StyleProp<TextStyle>;
  /** A result's subtitle. */
  rowSubtitle?: StyleProp<TextStyle>;
  /** The empty message. */
  empty?: StyleProp<TextStyle>;
  /** Section titles (grouped items, while not searching). */
  sectionHeader?: StyleProp<TextStyle>;
  /** Container of the "add" actions above the results. */
  extraActions?: StyleProp<ViewStyle>;
  /** Each action's label. */
  extraActionLabel?: StyleProp<TextStyle>;
  /** Not a style: color of the actions' `+` icon. */
  extraActionIconColor?: string;
  /** Not a style: color of the placeholder icon. */
  rowThumbnailPlaceholderIconColor?: string;
  /** Not a style: placeholder color of the search field. */
  placeholderTextColor?: string;
}

/** Text overrides of {@link PickerModal}, whatever the `locale`. */
export interface PickerModalLabels {
  /** Close button. Default: "Fermer" / "Close". */
  close?: string;
  /** Placeholder of the search field. Default: "Rechercher…" / "Search…". */
  searchPlaceholder?: string;
  /** What TalkBack reads on the search field. */
  searchAccessibilityLabel?: string;
  /** What TalkBack reads on the microphone button. */
  voiceSearchAccessibilityLabel?: string;
  /** Shown when nothing matches and no `emptyMessage` is given. */
  defaultEmptyMessage?: string;
  /**
   * Section of the items without a `group`, when others have one. Default:
   * "Autres" / "Other".
   */
  otherGroupLabel?: string;
}

/** Default style of each slot of {@link PickerModal}. */
export const defaultStyles: Required<PickerModalStyles> = {
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  close: { fontSize: 16, color: "#2563eb" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  search: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  rowThumbnailPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 16, fontWeight: "600", color: "#111827" },
  rowSubtitle: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 24 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 6,
  },
  extraActions: { marginBottom: 4 },
  extraActionLabel: { color: "#2563eb" },
  extraActionIconColor: "#2563eb",
  rowThumbnailPlaceholderIconColor: "#6b7280",
  placeholderTextColor: "#6b7280",
};

/** Built-in texts of {@link PickerModal}, per locale. */
export const defaultLabels = {
  fr: {
    close: "Fermer",
    searchPlaceholder: "Rechercher…",
    searchAccessibilityLabel: "Rechercher",
    voiceSearchAccessibilityLabel: "Dicter la recherche",
    defaultEmptyMessage: "Aucun résultat.",
    otherGroupLabel: "Autres",
  },
  en: {
    close: "Close",
    searchPlaceholder: "Search…",
    searchAccessibilityLabel: "Search",
    voiceSearchAccessibilityLabel: "Dictate the search",
    defaultEmptyMessage: "No results.",
    otherGroupLabel: "Other",
  },
} satisfies Record<KitLocale, Required<PickerModalLabels>>;
