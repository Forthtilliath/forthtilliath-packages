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
  /** Added on top of `button` for "−" at zero. */
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
  /** Receives the new value, already clamped to `0…max`. */
  onChange: (value: number) => void;
  /** What is being counted — used in the screen-reader labels. */
  label: string;
  /** @defaultValue 999 */
  max?: number;
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
 * A whole-number counter from 0 to `max`: −/+ buttons to adjust, and a
 * numeric field in the middle to type a large number in one go (non-digits
 * are dropped, the result is clamped).
 *
 * @example
 * ```tsx
 * import { QuantityStepper } from "@forthtilliath/react-native-kit/components/picker/QuantityStepper";
 *
 * <QuantityStepper value={count} onChange={setCount} label="Croissants" />
 * ```
 */
export function QuantityStepper({
  value,
  onChange,
  label,
  max = 999,
  locale,
  a11yLabels,
  styles,
}: QuantityStepperProps) {
  const labels = { ...defaultA11yLabels[useKitLocale(locale)], ...a11yLabels };
  const merged = mergeSlotStyles(defaultStyles, styles);

  function set(next: number) {
    onChange(Math.min(max, Math.max(0, next)));
  }

  return (
    <View style={merged.row}>
      <Pressable
        style={[merged.button, value === 0 && merged.buttonDisabled]}
        onPress={() => {
          set(value - 1);
        }}
        disabled={value === 0}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={labels.decrease(label)}
      >
        <Text style={merged.buttonText}>−</Text>
      </Pressable>
      <TextInput
        style={merged.input}
        value={String(value)}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "");
          set(digits === "" ? 0 : Number(digits));
        }}
        keyboardType="number-pad"
        selectTextOnFocus
        maxLength={String(max).length}
        accessibilityLabel={labels.input(label)}
      />
      <Pressable
        style={merged.button}
        onPress={() => {
          set(value + 1);
        }}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={labels.increase(label)}
      >
        <Text style={merged.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}
