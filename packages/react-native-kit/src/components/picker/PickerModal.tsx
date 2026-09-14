import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  PickerModalLabels,
  PickerModalStyles,
} from "./PickerModal.styles.js";
import { defaultLabels, defaultStyles } from "./PickerModal.styles.js";
import { PickerModalRow } from "./PickerModalRow.js";
import { usePickerModalSections } from "./usePickerModalSections.js";
import { VoiceSearchButton } from "./VoiceSearchButton.js";

export type {
  PickerModalLabels,
  PickerModalStyles,
} from "./PickerModal.styles.js";

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

  const sections = usePickerModalSections(
    filtered,
    isSearching,
    groupOrder,
    t.otherGroupLabel,
  );

  function handleSelect(item: PickerItem) {
    onSelect(item);
    setQuery("");
  }

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
            <PickerModalRow
              item={item}
              styles={merged}
              onSelect={handleSelect}
            />
          )}
        />
      </View>
    </Modal>
  );
}
