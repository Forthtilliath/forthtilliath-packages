import {
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

/**
 * Props of {@link QuantityStepperButton}.
 * @internal
 */
export interface QuantityStepperButtonProps {
  /** `-1` for "−", `1` for "+". */
  direction: 1 | -1;
  /** A tap moves by `step`, a long press by `longPressStep` (if set). */
  onTap: (delta: number) => void;
  /** Amount a tap moves by. */
  step: number;
  /** Amount a long press moves by, `undefined` for none. */
  longPressStep: number | undefined;
  /** Held: `onHoldStart` on press-in, `onHoldEnd` on press-out, no taps. */
  repeatOnHold: boolean;
  /** Starts the repeat in `direction` (with `repeatOnHold`). */
  onHoldStart: (direction: 1 | -1) => void;
  /** Stops the repeat. */
  onHoldEnd: () => void;
  /** Disables the button (bound reached, or the stepper disabled). */
  disabled: boolean;
  /** Merged style of the button. */
  style: StyleProp<ViewStyle>;
  /** Merged style of its "−" / "+". */
  textStyle: StyleProp<TextStyle>;
  /** Caps the system font scale on the sign. */
  maxFontSizeMultiplier: number | undefined;
  /** What TalkBack reads on the button. */
  accessibilityLabel: string;
}

/**
 * The "−" or "+" button of `QuantityStepper`.
 * @internal
 */
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
