import { useMemo } from "react";

import type { PickerItem } from "./PickerModal.js";

export interface PickerModalSection {
  title: string | null;
  data: PickerItem[];
}

// Sections sorted by title: stable order, independent of the source groups'
// order. No sections during a search (results ranked by relevance, not by
// group), nor if no item has a group (uncategorized pickers, unchanged
// behavior).
export function usePickerModalSections(
  filtered: PickerItem[],
  isSearching: boolean,
  groupOrder: string[] | undefined,
  otherGroupLabel: string,
): PickerModalSection[] {
  return useMemo(() => {
    if (isSearching || !filtered.some((item) => item.group)) {
      return [{ title: null, data: filtered }];
    }
    const byGroup = new Map<string, PickerItem[]>();
    for (const item of filtered) {
      const key = item.group ?? otherGroupLabel;
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
  }, [filtered, isSearching, groupOrder, otherGroupLabel]);
}
