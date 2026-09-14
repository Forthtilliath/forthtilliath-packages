import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

export interface PickerModalStyles {
  container?: StyleProp<ViewStyle>;
  header?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  close?: StyleProp<TextStyle>;
  searchRow?: StyleProp<ViewStyle>;
  search?: StyleProp<TextStyle>;
  row?: StyleProp<ViewStyle>;
  rowThumbnail?: StyleProp<ImageStyle>;
  rowThumbnailPlaceholder?: StyleProp<ViewStyle>;
  rowLabel?: StyleProp<TextStyle>;
  rowSubtitle?: StyleProp<TextStyle>;
  empty?: StyleProp<TextStyle>;
  sectionHeader?: StyleProp<TextStyle>;
  extraActions?: StyleProp<ViewStyle>;
  extraActionLabel?: StyleProp<TextStyle>;
  extraActionIconColor?: string;
  rowThumbnailPlaceholderIconColor?: string;
  placeholderTextColor?: string;
}

export interface PickerModalLabels {
  close?: string;
  searchPlaceholder?: string;
  searchAccessibilityLabel?: string;
  voiceSearchAccessibilityLabel?: string;
  defaultEmptyMessage?: string;
  otherGroupLabel?: string;
}

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

export const defaultLabels: Required<PickerModalLabels> = {
  close: "Fermer",
  searchPlaceholder: "Rechercher…",
  searchAccessibilityLabel: "Rechercher",
  voiceSearchAccessibilityLabel: "Dicter la recherche",
  defaultEmptyMessage: "Aucun résultat.",
  otherGroupLabel: "Autres",
};
