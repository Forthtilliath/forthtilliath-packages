import { useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, Text, TextInput, View } from "react-native";

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
  /** @defaultValue 0 */
  min?: number;
  /** @defaultValue 999 */
  max?: number;
  /**
   * Step applied by a long press on −/+, to reach large values quickly.
   * Unset, a long press does nothing more than a tap.
   */
  longPressStep?: number;
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

/**
 * A whole-number counter from `min` (0) to `max`: −/+ buttons to adjust
 * (optionally faster on long press), and a numeric field in the middle to
 * type a large number in one go (non-digits are dropped, the result is
 * clamped). A typed value below `min` (an empty field, the "2" of "25" with
 * `min={10}`) stays as typed until the field loses focus.
 *
 * @example
 * ```tsx
 * import { QuantityStepper } from "@forthtilliath/react-native-kit/components/picker/QuantityStepper";
 *
 * <QuantityStepper value={count} onChange={setCount} label="Croissants" />
 * <QuantityStepper value={bans} onChange={setBans} label="Bannissements" min={1} max={40} longPressStep={5} />
 * ```
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
  longPressStep,
  locale,
  a11yLabels,
  styles,
}: QuantityStepperProps) {
  const labels = { ...defaultA11yLabels[useKitLocale(locale)], ...a11yLabels };
  const merged = mergeSlotStyles(defaultStyles, styles);
  const atMin = value <= min;
  const atMax = value >= max;
  // Field text not sent yet: clamping it to `min` on every keystroke would
  // make any number starting below `min` impossible to type.
  const [draft, setDraft] = useState<string | null>(null);

  function set(next: number) {
    setDraft(null);
    onChange(Math.min(max, Math.max(min, next)));
  }

  return (
    <View style={merged.row}>
      <Pressable
        style={[merged.button, atMin && merged.buttonDisabled]}
        onPress={() => {
          set(value - 1);
        }}
        onLongPress={
          longPressStep === undefined
            ? undefined
            : () => {
                set(value - longPressStep);
              }
        }
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
          const digits = text.replace(/\D/g, "");
          if (digits === "" || Number(digits) < min) setDraft(digits);
          else set(Number(digits));
        }}
        onBlur={() => {
          if (draft !== null) set(draft === "" ? min : Number(draft));
        }}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={String(max).length}
        accessibilityLabel={labels.input(label)}
      />
      <Pressable
        style={[merged.button, atMax && merged.buttonDisabled]}
        onPress={() => {
          set(value + 1);
        }}
        onLongPress={
          longPressStep === undefined
            ? undefined
            : () => {
                set(value + longPressStep);
              }
        }
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
