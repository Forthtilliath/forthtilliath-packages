import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** One background on offer, drawn as a page with a card on it. */
export interface BackgroundOption {
  id: string;
  /** Shown under the swatch and read by screen readers. */
  label: string;
  /** The page colour. */
  page: string;
  /** The card drawn on the page. */
  card: string;
  /** The card's border. Defaults to `card`. */
  cardBorder?: string;
}

export interface BackgroundPickerStyles {
  /** The wrapping row of swatches. */
  row?: StyleProp<ViewStyle>;
  /** One option: swatch + label. */
  option?: StyleProp<ViewStyle>;
  swatch?: StyleProp<ViewStyle>;
  /** Added on top of `swatch` for the chosen one. */
  swatchSelected?: StyleProp<ViewStyle>;
  card?: StyleProp<ViewStyle>;
  /** The round badge holding the check mark. */
  check?: StyleProp<ViewStyle>;
  label?: StyleProp<TextStyle>;
  labelSelected?: StyleProp<TextStyle>;
  checkIconColor?: string;
}

export interface BackgroundPickerProps<T extends BackgroundOption> {
  options: readonly T[];
  /** Id of the chosen option. */
  value: string;
  /** Receives the chosen option — add a haptic tick here if wanted. */
  onChange: (option: T) => void;
  styles?: BackgroundPickerStyles;
}

const defaultStyles = {
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 } satisfies ViewStyle,
  option: {
    flexGrow: 1,
    flexBasis: "22%",
    alignItems: "center",
    gap: 4,
  } satisfies ViewStyle,
  swatch: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d4d4d4",
    padding: 8,
    justifyContent: "flex-end",
  } satisfies ViewStyle,
  swatchSelected: { borderColor: "#2563eb" } satisfies ViewStyle,
  card: { height: "45%", borderRadius: 6, borderWidth: 1 } satisfies ViewStyle,
  check: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  label: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "600",
  } satisfies TextStyle,
  labelSelected: { color: "#111827" } satisfies TextStyle,
};

/**
 * The option with this id, or the first one (the original background) if the
 * id is unknown — a background removed since it was saved, or none saved yet.
 *
 * @throws {RangeError} If `options` is empty.
 */
export function findBackground<T extends BackgroundOption>(
  options: readonly T[],
  id: string | null | undefined,
): T {
  const found = options.find((option) => option.id === id) ?? options[0];
  if (!found) throw new RangeError("findBackground needs at least one option");
  return found;
}

/**
 * Radio group of background swatches: each one draws the page and a card in
 * the colours on offer, the chosen one outlined with a check mark. Pair it
 * with `findBackground` to read the saved id, and check each palette's
 * contrast with `contrastRatio` from `@forthtilliath/ts-kit/color`.
 *
 * @example
 * ```tsx
 * <BackgroundPicker
 *   options={[
 *     { id: "night", label: "Bleu nuit", page: "#0f172a", card: "#1e293b" },
 *     { id: "felt", label: "Tapis vert", page: "#0b1f15", card: "#112c1e" },
 *   ]}
 *   value={settings.background}
 *   onChange={(option) => { selectFeedback(); save(option.id); }}
 * />
 * ```
 */
export function BackgroundPicker<T extends BackgroundOption>({
  options,
  value,
  onChange,
  styles,
}: BackgroundPickerProps<T>) {
  const merged = mergeSlotStyles(defaultStyles, styles);
  const checkIconColor = styles?.checkIconColor ?? "#ffffff";

  return (
    <View style={merged.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            style={merged.option}
            onPress={() => {
              onChange(option);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={option.label}
          >
            <View
              style={[
                merged.swatch,
                { backgroundColor: option.page },
                selected && merged.swatchSelected,
              ]}
            >
              <View
                style={[
                  merged.card,
                  {
                    backgroundColor: option.card,
                    borderColor: option.cardBorder ?? option.card,
                  },
                ]}
              />
              {selected && (
                <View style={merged.check}>
                  <Ionicons name="checkmark" size={14} color={checkIconColor} />
                </View>
              )}
            </View>
            <Text
              style={[merged.label, selected && merged.labelSelected]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
