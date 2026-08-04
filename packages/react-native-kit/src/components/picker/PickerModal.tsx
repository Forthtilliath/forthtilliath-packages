import { useMemo, useState } from "react";
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import {
  Image,
  Modal,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { VoiceSearchButton } from "./VoiceSearchButton.js";

export interface PickerItem {
  id: number;
  label: string;
  subtitle?: string;
  imageUri?: string | null;
  /**
   * Groups results into sections (e.g. food groups, ingredients vs recipes)
   * while browsing without searching. Ignored during an active search: the
   * best global matches are shown instead, not the grouped-by-section list.
   */
  group?: string;
}

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

export interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  emptyMessage?: string;
  /** Initial search text on open; defaults to empty. */
  initialQuery?: string;
  /** Custom filter (e.g. relevance ranking); defaults to a case-insensitive substring match. */
  filterItems?: (items: PickerItem[], query: string) => PickerItem[];
  /** "Add" actions always visible at the top, even when the search matches nothing. */
  extraActions?: { label: string; onPress: () => void }[];
  /**
   * Explicit section order (e.g. "Recent" before others); sections default
   * to alphabetical order by title. A group absent from this list is placed
   * after, alphabetically.
   */
  groupOrder?: string[];
  labels?: PickerModalLabels;
  styles?: PickerModalStyles;
}

const defaultStyles: Required<PickerModalStyles> = {
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

const defaultLabels: Required<PickerModalLabels> = {
  close: "Fermer",
  searchPlaceholder: "Rechercher…",
  searchAccessibilityLabel: "Rechercher",
  voiceSearchAccessibilityLabel: "Dicter la recherche",
  defaultEmptyMessage: "Aucun résultat.",
  otherGroupLabel: "Autres",
};

// Full-screen picker: search (typed or dictated), optional sections, and
// "add" actions always visible above the results.
export function PickerModal({
  visible,
  title,
  items,
  onSelect,
  onClose,
  emptyMessage,
  initialQuery,
  filterItems,
  extraActions,
  groupOrder,
  labels,
  styles,
}: PickerModalProps) {
  // Style fields are merged as arrays (default, then override) so a partial
  // override only changes the properties it specifies instead of replacing
  // the whole default style object (e.g. losing rowThumbnailPlaceholder's
  // alignItems/justifyContent by only overriding its backgroundColor).
  const merged = useMemo(
    () => ({
      container: [defaultStyles.container, styles?.container],
      header: [defaultStyles.header, styles?.header],
      title: [defaultStyles.title, styles?.title],
      close: [defaultStyles.close, styles?.close],
      searchRow: [defaultStyles.searchRow, styles?.searchRow],
      search: [defaultStyles.search, styles?.search],
      row: [defaultStyles.row, styles?.row],
      rowThumbnail: [defaultStyles.rowThumbnail, styles?.rowThumbnail],
      rowThumbnailPlaceholder: [
        defaultStyles.rowThumbnailPlaceholder,
        styles?.rowThumbnailPlaceholder,
      ],
      rowLabel: [defaultStyles.rowLabel, styles?.rowLabel],
      rowSubtitle: [defaultStyles.rowSubtitle, styles?.rowSubtitle],
      empty: [defaultStyles.empty, styles?.empty],
      sectionHeader: [defaultStyles.sectionHeader, styles?.sectionHeader],
      extraActions: [defaultStyles.extraActions, styles?.extraActions],
      extraActionLabel: [
        defaultStyles.extraActionLabel,
        styles?.extraActionLabel,
      ],
      extraActionIconColor:
        styles?.extraActionIconColor ?? defaultStyles.extraActionIconColor,
      rowThumbnailPlaceholderIconColor:
        styles?.rowThumbnailPlaceholderIconColor ??
        defaultStyles.rowThumbnailPlaceholderIconColor,
      placeholderTextColor:
        styles?.placeholderTextColor ?? defaultStyles.placeholderTextColor,
    }),
    [styles],
  );
  const t = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
  const [query, setQuery] = useState(initialQuery ?? "");
  // Reset the search each time the modal (re-)opens — adjusted during render
  // rather than in an effect, since it only needs to happen once per
  // visible-transition and must be visible in the very first render after it.
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setQuery(initialQuery ?? "");
  }

  const isSearching = query.trim().length > 0;
  const filtered = useMemo(() => {
    if (!isSearching) return items;
    if (filterItems) return filterItems(items, query);
    const q = query.trim().toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query, filterItems, isSearching]);

  // Sections sorted by title: stable order, independent of the source
  // groups' order. No sections during a search (results ranked by relevance,
  // not by group), nor if no item has a group (uncategorized pickers,
  // unchanged behavior).
  const sections = useMemo(() => {
    if (isSearching || !filtered.some((item) => item.group)) {
      return [{ title: null as string | null, data: filtered }];
    }
    const byGroup = new Map<string, PickerItem[]>();
    for (const item of filtered) {
      const key = item.group ?? t.otherGroupLabel;
      const group = byGroup.get(key);
      if (group) group.push(item);
      else byGroup.set(key, [item]);
    }
    function sortIndex(groupTitle: string): number {
      const index = groupOrder?.indexOf(groupTitle) ?? -1;
      return index === -1 ? (groupOrder?.length ?? 0) : index;
    }
    return [...byGroup.entries()]
      .sort(([a], [b]) => sortIndex(a) - sortIndex(b) || a.localeCompare(b))
      .map(([sectionTitle, data]) => ({ title: sectionTitle, data }));
  }, [filtered, isSearching, groupOrder, t.otherGroupLabel]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={merged.container}>
        <View style={merged.header}>
          <Text style={merged.title}>{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t.close}
          >
            <Text style={merged.close}>{t.close}</Text>
          </Pressable>
        </View>
        <View style={merged.searchRow}>
          <TextInput
            style={merged.search}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={merged.placeholderTextColor}
            value={query}
            onChangeText={setQuery}
            autoFocus
            accessibilityLabel={t.searchAccessibilityLabel}
          />
          <VoiceSearchButton
            onResult={setQuery}
            accessibilityLabel={t.voiceSearchAccessibilityLabel}
          />
        </View>
        <SectionList
          sections={sections}
          keyExtractor={(item: PickerItem) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            extraActions && extraActions.length > 0 ? (
              <View style={merged.extraActions}>
                {extraActions.map((action) => (
                  <Pressable
                    key={action.label}
                    style={merged.row}
                    onPress={action.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={merged.extraActionIconColor}
                    />
                    <Text style={[merged.rowLabel, merged.extraActionLabel]}>
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Text style={merged.empty}>
              {emptyMessage ?? t.defaultEmptyMessage}
            </Text>
          }
          renderSectionHeader={({
            section: { title: sectionTitle },
          }: {
            section: { title: string | null };
          }) =>
            sectionTitle ? (
              <Text style={merged.sectionHeader}>{sectionTitle}</Text>
            ) : null
          }
          renderItem={({ item }: { item: PickerItem }) => (
            <Pressable
              style={merged.row}
              onPress={() => {
                onSelect(item);
                setQuery("");
              }}
              accessibilityRole="button"
              accessibilityLabel={
                item.subtitle ? `${item.label}, ${item.subtitle}` : item.label
              }
            >
              {item.imageUri ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={merged.rowThumbnail}
                  accessibilityIgnoresInvertColors
                />
              ) : item.imageUri === null ? (
                <View style={merged.rowThumbnailPlaceholder}>
                  <Ionicons
                    name="cube-outline"
                    size={18}
                    color={merged.rowThumbnailPlaceholderIconColor}
                  />
                </View>
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={merged.rowLabel}>{item.label}</Text>
                {item.subtitle ? (
                  <Text style={merged.rowSubtitle}>{item.subtitle}</Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
