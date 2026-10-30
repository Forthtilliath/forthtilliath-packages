import {
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export interface QuantityStepperButtonProps {
  /** `-1` for "−", `1` for "+". */
  direction: 1 | -1;
  /** A tap moves by `step`, a long press by `longPressStep` (if set). */
  onTap: (delta: number) => void;
  step: number;
  longPressStep: number | undefined;
  /** Held: `onHoldStart` on press-in, `onHoldEnd` on press-out, no taps. */
  repeatOnHold: boolean;
  onHoldStart: (direction: 1 | -1) => void;
  onHoldEnd: () => void;
  disabled: boolean;
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  maxFontSizeMultiplier: number | undefined;
  accessibilityLabel: string;
}

/** The "−" or "+" button of `QuantityStepper`. */
export function QuantityStepperButton({
  direction,
  onTap,
  step,
  longPressStep,
  repeatOnHold,
  onHoldStart,
  onHoldEnd,
  disabled,
  style,
  textStyle,
  maxFontSizeMultiplier,
  accessibilityLabel,
}: QuantityStepperButtonProps) {
  return (
    <Pressable
      style={style}
      onPress={
        repeatOnHold
          ? undefined
          : () => {
              onTap(direction * step);
            }
      }
      onLongPress={
        !repeatOnHold && longPressStep !== undefined
          ? () => {
              onTap(direction * longPressStep);
            }
          : undefined
      }
      onPressIn={
        repeatOnHold
          ? () => {
              onHoldStart(direction);
            }
          : undefined
      }
      onPressOut={repeatOnHold ? onHoldEnd : undefined}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={textStyle} maxFontSizeMultiplier={maxFontSizeMultiplier}>
        {direction < 0 ? "−" : "+"}
      </Text>
    </Pressable>
  );
}
