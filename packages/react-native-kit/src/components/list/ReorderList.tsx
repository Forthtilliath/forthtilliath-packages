import type { ReactNode } from "react";
import type { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { moveItem } from "@forthtilliath/ts-kit/array/moveItem";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link ReorderList}, each merged after its default. */
export interface ReorderListStyles {
  list?: StyleProp<ViewStyle>;
  row?: StyleProp<ViewStyle>;
  /** The "1", "2"… before each item. */
  position?: StyleProp<TextStyle>;
  /** The item's label (default content). */
  label?: StyleProp<TextStyle>;
  arrow?: StyleProp<ViewStyle>;
  /** Added to the arrow that can't move (first ▲, last ▼). */
  arrowDisabled?: StyleProp<ViewStyle>;
  /** Not a style: the chevrons' color. */
  arrowColor?: ColorValue;
}

export interface ReorderListLabels {
  /** Spoken name of ▲, from the item's label. */
  moveUp: (label: string) => string;
  /** Spoken name of ▼, from the item's label. */
  moveDown: (label: string) => string;
}

export interface ReorderListProps<T> {
  items: readonly T[];
  keyExtractor: (item: T) => string;
  /** The item's name: shown by default, and in the arrows' spoken names. */
  getLabel: (item: T) => string;
  /** Receives the reordered copy, and which position moved where. */
  onChange: (items: T[], move: { from: number; to: number }) => void;
  /** Replaces the label between the position and the arrows (avatar + name…). */
  renderItem?: (item: T, index: number) => ReactNode;
  /** Shows "1", "2"… before each item. @defaultValue true */
  showPosition?: boolean;
  /** Called on each move, before `onChange` — e.g. `selectFeedback`. */
  onMoveFeedback?: () => void;
  locale?: KitLocale;
  labels?: Partial<ReorderListLabels>;
  styles?: ReorderListStyles;
}

const defaultLabels: Record<KitLocale, ReorderListLabels> = {
  fr: { moveUp: (l) => `Monter ${l}`, moveDown: (l) => `Descendre ${l}` },
  en: { moveUp: (l) => `Move ${l} up`, moveDown: (l) => `Move ${l} down` },
};

const defaultStyles = {
  list: { gap: 4 } satisfies ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  } satisfies ViewStyle,
  position: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "700",
    color: "#6b7280",
  } satisfies TextStyle,
  label: { flex: 1, fontSize: 15, color: "#111111" } satisfies TextStyle,
  arrow: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  } satisfies ViewStyle,
  arrowDisabled: { opacity: 0.3 } satisfies ViewStyle,
  arrowColor: "#111111",
};

/**
 * A list reordered with ▲ / ▼ buttons instead of drag and drop: works with
 * TalkBack, in a `ScrollView`, and needs no gesture library. Each arrow is
 * named after its item ("Monter Marie"), and since rows are keyed, the
 * screen-reader focus follows the item it just moved.
 *
 * Needs `@expo/vector-icons` (the chevrons).
 *
 * @example
 * ```tsx
 * import { ReorderList } from "@forthtilliath/react-native-kit/components/list/ReorderList";
 *
 * <ReorderList
 *   items={players}
 *   keyExtractor={(p) => p.id}
 *   getLabel={(p) => p.name}
 *   onChange={(next) => setOrder(next.map((p) => p.id))}
 *   onMoveFeedback={selectFeedback}
 * />
 * ```
 */
export function ReorderList<T>({
  items,
  keyExtractor,
  getLabel,
  onChange,
  renderItem,
  showPosition = true,
  onMoveFeedback,
  locale,
  labels,
  styles,
}: ReorderListProps<T>) {
  const resolvedLocale = useKitLocale(locale);
  const text = { ...defaultLabels[resolvedLocale], ...labels };
  const merged = mergeSlotStyles(defaultStyles, styles);
  const arrowColor = styles?.arrowColor ?? defaultStyles.arrowColor;

  const move = (from: number, offset: -1 | 1) => {
    const next = moveItem([...items], from, offset);
    onMoveFeedback?.();
    onChange(next, { from, to: from + offset });
  };

  const arrow = (index: number, offset: -1 | 1, label: string) => {
    const disabled = offset < 0 ? index === 0 : index === items.length - 1;
    return (
      <Pressable
        style={[merged.arrow, disabled && merged.arrowDisabled]}
        disabled={disabled}
        hitSlop={4}
        onPress={() => {
          move(index, offset);
        }}
        accessibilityRole="button"
        accessibilityLabel={
          offset < 0 ? text.moveUp(label) : text.moveDown(label)
        }
      >
        <Ionicons
          name={offset < 0 ? "chevron-up" : "chevron-down"}
          size={22}
          color={arrowColor}
        />
      </Pressable>
    );
  };

  return (
    <View style={merged.list}>
      {items.map((item, index) => {
        const label = getLabel(item);
        return (
          <View key={keyExtractor(item)} style={merged.row}>
            {showPosition && <Text style={merged.position}>{index + 1}</Text>}
            {renderItem ? (
              <View style={{ flex: 1 }}>{renderItem(item, index)}</View>
            ) : (
              <Text style={merged.label} numberOfLines={1}>
                {label}
              </Text>
            )}
            {arrow(index, -1, label)}
            {arrow(index, 1, label)}
          </View>
        );
      })}
    </View>
  );
}
