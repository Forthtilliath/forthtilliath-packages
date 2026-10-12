import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { mondayFirstWeekday } from "@forthtilliath/ts-kit/date/mondayFirstWeekday";
import { parseIsoDate } from "@forthtilliath/ts-kit/date/parseIsoDate";

import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link MonthDayGrid}, each merged after its default. */
export interface MonthDayGridStyles {
  /** Wraps the weekday header row and the grid. */
  container?: StyleProp<ViewStyle>;
  /** The weekday header row. */
  weekdayRow?: StyleProp<ViewStyle>;
  /** Each weekday initial. */
  weekdayText?: StyleProp<TextStyle>;
  /** The wrapping grid of days. */
  grid?: StyleProp<ViewStyle>;
  /** One seventh of the width — headers, leading blanks, and days alike. */
  cell?: StyleProp<ViewStyle>;
  /** The round, tappable day. */
  dayBox?: StyleProp<ViewStyle>;
  /** Added on top of `dayBox` for a selected day. */
  dayBoxSelected?: StyleProp<ViewStyle>;
  /** The day number. */
  dayText?: StyleProp<TextStyle>;
  /** Added on top of `dayText` for a selected day. */
  dayTextSelected?: StyleProp<TextStyle>;
}

export interface MonthDayGridProps {
  /** The month's days in order, as `YYYY-MM-DD` dates. */
  days: readonly string[];
  /** The selected days, as `YYYY-MM-DD` dates. */
  selected: ReadonlySet<string>;
  /** Called with the tapped day; the host adds it to or removes it from `selected`. */
  onToggle: (day: string) => void;
  /** Seven column headers, Monday first. Defaults to the locale's initials. */
  weekdayLabels?: readonly string[];
  /**
   * Language of the default `weekdayLabels` — French by default, or the
   * nearest `KitLocaleProvider`'s.
   */
  locale?: KitLocale;
  /** Per-slot style overrides — see {@link MonthDayGridStyles}. */
  styles?: MonthDayGridStyles;
}

const defaultWeekdayLabels: Record<KitLocale, readonly string[]> = {
  fr: ["L", "M", "M", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
};

const defaultStyles = {
  container: {} satisfies ViewStyle,
  weekdayRow: { flexDirection: "row" } satisfies ViewStyle,
  weekdayText: {
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.6,
    color: "#111111",
  } satisfies TextStyle,
  grid: { flexDirection: "row", flexWrap: "wrap" } satisfies ViewStyle,
  cell: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 2,
  } satisfies ViewStyle,
  dayBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  dayBoxSelected: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  } satisfies ViewStyle,
  dayText: { fontSize: 12, color: "#111111" } satisfies TextStyle,
  dayTextSelected: { color: "#ffffff", fontWeight: "700" } satisfies TextStyle,
};

/**
 * A Monday-first month calendar where days are toggled on and off — public
 * holidays, days off, availability… The first day is offset under its
 * weekday column; the selection itself lives in the host.
 *
 * @example
 * ```tsx
 * import { MonthDayGrid } from "@forthtilliath/react-native-kit/components/picker/MonthDayGrid";
 *
 * <MonthDayGrid
 *   days={daysOfMonth}
 *   selected={holidays}
 *   onToggle={(day) => setHolidays((prev) => toggleInSet(prev, day))}
 * />
 * ```
 */
export function MonthDayGrid({
  days,
  selected,
  onToggle,
  weekdayLabels,
  locale,
  styles,
}: MonthDayGridProps) {
  const resolvedLocale = useKitLocale(locale);
  const headers = weekdayLabels ?? defaultWeekdayLabels[resolvedLocale];
  const merged = mergeSlotStyles(defaultStyles, styles);
  const firstDay = days[0];
  const leadingBlanks = firstDay ? mondayFirstWeekday(firstDay) : 0;

  return (
    <View style={merged.container}>
      <View style={merged.weekdayRow}>
        {headers.map((header, i) => (
          // Initials repeat (M, M / S, S): the column index is the identity.
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <View key={i} style={merged.cell}>
            <Text style={merged.weekdayText}>{header}</Text>
          </View>
        ))}
      </View>
      <View style={merged.grid}>
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <View key={`blank-${String(i)}`} style={merged.cell} />
        ))}
        {days.map((day) => {
          const isSelected = selected.has(day);
          return (
            <View key={day} style={merged.cell}>
              <Pressable
                style={[merged.dayBox, isSelected && merged.dayBoxSelected]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                onPress={() => {
                  onToggle(day);
                }}
              >
                <Text
                  style={[merged.dayText, isSelected && merged.dayTextSelected]}
                >
                  {parseIsoDate(day).getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
