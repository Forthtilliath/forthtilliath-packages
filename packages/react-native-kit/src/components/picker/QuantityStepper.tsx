import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { usePressRepeat } from "../../hooks/usePressRepeat.js";
import { type KitLocale, useKitLocale } from "../../i18n/locale.js";
import { mergeSlotStyles } from "../../utils/helpers/mergeSlotStyles.js";
import {
  defaultA11yLabels,
  defaultStyles,
  type QuantityStepperA11yLabels,
  type QuantityStepperStyles,
} from "./QuantityStepper.styles.js";

export type {
  QuantityStepperA11yLabels,
  QuantityStepperStyles,
} from "./QuantityStepper.styles.js";

export interface QuantityStepperProps {
  value: number;
  /** Receives the new value, already clamped to `min…max`. */
  onChange: (value: number) => void;
  /** What is being counted — used in the screen-reader labels. */
  label: string;
  /**
   * Below 0, negative values are allowed: the field then accepts a leading
   * "-" (and opens the keyboard that has one). `-Infinity`: no lower bound.
   * @defaultValue 0
   */
  min?: number;
  /** `Infinity`: no upper bound. @defaultValue 999 */
  max?: number;
  /**
   * How much −/+ (and each repeat while held) move the value, e.g. `4` for a
   * category worth 4 points a unit. Typing in the field is not snapped to it.
   * @defaultValue 1
   */
  step?: number;
  /**
   * Called with the new value each time −/+ change it (tap, long press, each
   * repeat while held) — not on typing. The place for a haptic tick:
   * `onStep={tapFeedback}` (from `utils/helpers/haptics`).
   */
  onStep?: (value: number) => void;
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

/** Keeps the digits, and a leading "-" when negatives are allowed. */
function sanitize(text: string, allowsNegative: boolean) {
  const digits = text.replace(/\D/g, "");
  return allowsNegative && text.trimStart().startsWith("-")
    ? `-${digits}`
    : digits;
}

/** Characters a bound takes in the field; 15 digits (+ "-") if unbounded. */
function lengthOf(bound: number) {
  if (Number.isFinite(bound)) return String(bound).length;
  return bound < 0 ? 16 : 15;
}

/**
 * A whole-number counter from `min` (0) to `max`: −/+ buttons to adjust by
 * `step` (optionally faster on long press, or repeating while held), and a
 * numeric field in the middle to type a large number in one go (other
 * characters are dropped, the result is clamped). A typed value that is not a
 * number yet or below `min` (an empty field, a lone "-", the "2" of "25" with
 * `min={10}`) stays as typed until the field loses focus. A negative `min`
 * allows negative values (penalties, defeat tokens…); `-Infinity`/`Infinity`
 * remove a bound.
 *
 * @example
 * ```tsx
 * import { QuantityStepper } from "@forthtilliath/react-native-kit/components/picker/QuantityStepper";
 *
 * <QuantityStepper value={count} onChange={setCount} label="Croissants" />
 * <QuantityStepper value={bans} onChange={setBans} label="Bannissements" min={1} max={40} longPressStep={5} />
 * <QuantityStepper value={score} onChange={setScore} label="Points" min={-Infinity} max={Infinity} step={4} repeatOnHold onStep={tapFeedback} />
 * ```
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
  step = 1,
  onStep,
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

  /** A −/+ press: moves by `delta`; `false` when a bound stopped it. */
  function stepBy(delta: number): boolean {
    const next = clamp(valueRef.current + delta);
    if (next === valueRef.current) return false;
    valueRef.current = next;
    set(next);
    onStep?.(next);
    return true;
  }

  function startRepeat(direction: 1 | -1) {
    repeat.start(() => {
      // A button disabled at its bound may never report the release.
      if (!stepBy(direction * step)) repeat.stop();
    });
  }

  // Held: repeat from press-in to press-out. Otherwise: one step per tap,
  // and `longPressStep` on long press.
  const tapsOnly = !repeatOnHold;
  const jumps = tapsOnly && longPressStep !== undefined;

  // A tap starts from the rendered value, even if the parent ignored the
  // previous onChange.
  function tap(delta: number) {
    valueRef.current = value;
    stepBy(delta);
  }

  function pressHandlers(direction: 1 | -1) {
    return {
      onPress: tapsOnly
        ? () => {
            tap(direction * step);
          }
        : undefined,
      onLongPress: jumps
        ? () => {
            tap(direction * longPressStep);
          }
        : undefined,
      onPressIn: repeatOnHold
        ? () => {
            startRepeat(direction);
          }
        : undefined,
      onPressOut: repeatOnHold ? repeat.stop : undefined,
    };
  }

  return (
    <View style={merged.row}>
      <Pressable
        style={[merged.button, atMin && merged.buttonDisabled]}
        {...pressHandlers(-1)}
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
        maxLength={Math.max(lengthOf(min), lengthOf(max))}
        accessibilityLabel={labels.input(label)}
      />
      <Pressable
        style={[merged.button, atMax && merged.buttonDisabled]}
        {...pressHandlers(1)}
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
