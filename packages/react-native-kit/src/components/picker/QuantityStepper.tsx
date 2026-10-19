import { useEffect, useRef, useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, TextInput, View } from "react-native";

import { usePressRepeat } from "../../hooks/usePressRepeat.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";

/** Per-slot style overrides for {@link QuantityStepper}, each merged after its default. */
export interface QuantityStepperStyles {
  /** The row: − button, field, + button. */
  row?: StyleProp<ViewStyle>;
  /** Both round buttons. */
  button?: StyleProp<ViewStyle>;
  /** Added on top of `button` for "−" at `min` and "+" at `max`. */
  buttonDisabled?: StyleProp<ViewStyle>;
  /** The "−" / "+" glyphs. */
  buttonText?: StyleProp<TextStyle>;
  /** The numeric field in the middle (its text color included). */
  input?: StyleProp<TextStyle>;
}

/** Screen-reader labels of the three controls, built from the stepper's `label`. */
export interface QuantityStepperA11yLabels {
  decrease: (label: string) => string;
  increase: (label: string) => string;
  input: (label: string) => string;
}

export interface QuantityStepperProps {
  value: number;
  /** Receives the new value, already clamped to `min…max`. */
  onChange: (value: number) => void;
  /** What is being counted — used in the screen-reader labels. */
  label: string;
  /**
   * Below 0, negative values are allowed: the field then accepts a leading
   * "-" (and opens the keyboard that has one).
   * @defaultValue 0
   */
  min?: number;
  /** @defaultValue 999 */
  max?: number;
  /**
   * Step applied by a long press on −/+, to reach large values quickly.
   * Unset, a long press does nothing more than a tap. Ignored with
   * `repeatOnHold`.
   */
  longPressStep?: number;
  /**
   * Holding −/+ repeats the step, faster and faster (see `usePressRepeat`),
   * until released or a bound is reached.
   * @defaultValue false
   */
  repeatOnHold?: boolean;
  /**
   * Language of the default screen-reader labels — French by default, or the
   * nearest `KitLocaleProvider`'s.
   */
  locale?: KitLocale;
  /** Overrides some or all of the screen-reader labels. */
  a11yLabels?: Partial<QuantityStepperA11yLabels>;
  /** Per-slot style overrides — see {@link QuantityStepperStyles}. */
  styles?: QuantityStepperStyles;
}

const defaultA11yLabels: Record<KitLocale, QuantityStepperA11yLabels> = {
  fr: {
    decrease: (label) => `Retirer : ${label}`,
    increase: (label) => `Ajouter : ${label}`,
    input: (label) => `Quantité : ${label}`,
  },
  en: {
    decrease: (label) => `Decrease: ${label}`,
    increase: (label) => `Increase: ${label}`,
    input: (label) => `Quantity: ${label}`,
  },
};

const defaultStyles = {
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  } satisfies ViewStyle,
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  } satisfies ViewStyle,
  buttonDisabled: { opacity: 0.35 } satisfies ViewStyle,
  buttonText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  } satisfies TextStyle,
  input: {
    width: 52,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    padding: 0,
  } satisfies TextStyle,
};

/** Keeps the digits, and a leading "-" when negatives are allowed. */
function sanitize(text: string, allowsNegative: boolean) {
  const digits = text.replace(/\D/g, "");
  return allowsNegative && text.trimStart().startsWith("-")
    ? `-${digits}`
    : digits;
}

/**
 * A whole-number counter from `min` (0) to `max`: −/+ buttons to adjust
 * (optionally faster on long press, or repeating while held), and a numeric
 * field in the middle to type a large number in one go (other characters are
 * dropped, the result is clamped). A typed value that is not a number yet or
 * below `min` (an empty field, a lone "-", the "2" of "25" with `min={10}`)
 * stays as typed until the field loses focus. A negative `min` allows
 * negative values (penalties, defeat tokens…).
 *
 * @example
 * ```tsx
 * import { QuantityStepper } from "@forthtilliath/react-native-kit/components/picker/QuantityStepper";
 *
 * <QuantityStepper value={count} onChange={setCount} label="Croissants" />
 * <QuantityStepper value={bans} onChange={setBans} label="Bannissements" min={1} max={40} longPressStep={5} />
 * <QuantityStepper value={score} onChange={setScore} label="Points" min={-999} repeatOnHold />
 * ```
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
  longPressStep,
  repeatOnHold = false,
  locale,
  a11yLabels,
  styles,
}: QuantityStepperProps) {
  const labels = { ...defaultA11yLabels[useKitLocale(locale)], ...a11yLabels };
  const merged = mergeSlotStyles(defaultStyles, styles);
  const atMin = value <= min;
  const atMax = value >= max;
  const allowsNegative = min < 0;
  // Field text not sent yet: clamping it to `min` on every keystroke would
  // make any number starting below `min` impossible to type.
  const [draft, setDraft] = useState<string | null>(null);
  const repeat = usePressRepeat();
  // Value during a repeat, ahead of the `value` prop until the parent
  // re-renders with each onChange.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  function set(next: number) {
    setDraft(null);
    onChange(clamp(next));
  }

  function stepBy(delta: number) {
    const next = clamp(valueRef.current + delta);
    // A button disabled at its bound may never report the release.
    if (next === valueRef.current) {
      repeat.stop();
      return;
    }
    valueRef.current = next;
    set(next);
  }

  function startRepeat(delta: 1 | -1) {
    repeat.start(() => {
      stepBy(delta);
    });
  }

  // Held: repeat from press-in to press-out. Otherwise: one step per tap,
  // and `longPressStep` on long press.
  const tapsOnly = !repeatOnHold;
  const jumps = tapsOnly && longPressStep !== undefined;

  return (
    <View style={merged.row}>
      <Pressable
        style={[merged.button, atMin && merged.buttonDisabled]}
        onPress={
          tapsOnly
            ? () => {
                set(value - 1);
              }
            : undefined
        }
        onLongPress={
          jumps
            ? () => {
                set(value - longPressStep);
              }
            : undefined
        }
        onPressIn={
          repeatOnHold
            ? () => {
                startRepeat(-1);
              }
            : undefined
        }
        onPressOut={repeatOnHold ? repeat.stop : undefined}
        disabled={atMin}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={labels.decrease(label)}
      >
        <Text style={merged.buttonText}>−</Text>
      </Pressable>
      <TextInput
        style={merged.input}
        value={draft ?? String(value)}
        onChangeText={(text) => {
          const cleaned = sanitize(text, allowsNegative);
          const typed = Number(cleaned);
          if (cleaned === "" || cleaned === "-" || typed < min) {
            setDraft(cleaned);
          } else set(typed);
        }}
        onBlur={() => {
          if (draft === null) return;
          // Nothing typed yet: back to 0, or to the nearest bound.
          set(draft === "" || draft === "-" ? 0 : Number(draft));
        }}
        // "number-pad" has no "-" key on Android.
        keyboardType={allowsNegative ? "numeric" : "number-pad"}
        selectTextOnFocus
        maxLength={Math.max(String(min).length, String(max).length)}
        accessibilityLabel={labels.input(label)}
      />
      <Pressable
        style={[merged.button, atMax && merged.buttonDisabled]}
        onPress={
          tapsOnly
            ? () => {
                set(value + 1);
              }
            : undefined
        }
        onLongPress={
          jumps
            ? () => {
                set(value + longPressStep);
              }
            : undefined
        }
        onPressIn={
          repeatOnHold
            ? () => {
                startRepeat(1);
              }
            : undefined
        }
        onPressOut={repeatOnHold ? repeat.stop : undefined}
        disabled={atMax}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={labels.increase(label)}
      >
        <Text style={merged.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}
