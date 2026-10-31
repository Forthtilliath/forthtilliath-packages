import { useState } from "react";

import { parseIntegerInput } from "@forthtilliath/ts-kit/number/parseIntegerInput";
import { sanitizeIntegerInput } from "@forthtilliath/ts-kit/number/sanitizeIntegerInput";

import { TextField, type TextFieldProps } from "./TextField.js";

export interface IntegerFieldProps extends Omit<
  TextFieldProps,
  "value" | "onChange" | "onChangeText" | "keyboardType" | "defaultValue"
> {
  value: number;
  /** Receives each valid value, within `min`…`max`. */
  onChange: (value: number) => void;
  /** @defaultValue -Infinity */
  min?: number;
  /** @defaultValue Infinity */
  max?: number;
}

/**
 * A whole-number field where typing works like plain text: a negative number
 * is typed normally (a lone "-" isn't replaced with 0), an emptied field
 * stays empty while typing, and pasted junk is cleaned (spaces, letters…).
 * Each valid value within `min`…`max` goes to `onChange`; on leaving the
 * field, an out-of-range value is brought back within the bounds and an
 * unfinished one ("", "-") shows the last valid value again.
 *
 * Takes every {@link TextField} prop (label, hint, error, colors…).
 *
 * @example
 * ```tsx
 * import { IntegerField } from "@forthtilliath/react-native-kit/components/form/IntegerField";
 *
 * <IntegerField label="Points de merveille" value={points} onChange={setPoints} min={-30} max={99} />
 * ```
 */
export function IntegerField({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  onBlur,
  maxLength,
  ...field
}: IntegerFieldProps) {
  // The text being typed while it isn't (yet) a valid value; null = show `value`.
  const [draft, setDraft] = useState<string | null>(null);
  const allowNegative = min < 0;
  const inRange = (n: number) => n >= min && n <= max;

  return (
    <TextField
      {...field}
      // Android's "number-pad" has no minus key.
      keyboardType={allowNegative ? "numeric" : "number-pad"}
      // 16 digits + sign: beyond, a number is no longer exact anyway.
      maxLength={maxLength ?? 17}
      value={draft ?? String(value)}
      onChangeText={(raw) => {
        const cleaned = sanitizeIntegerInput(raw, { allowNegative });
        const parsed = parseIntegerInput(cleaned);
        if (parsed !== null && inRange(parsed)) {
          setDraft(null);
          if (parsed !== value) onChange(parsed);
        } else {
          setDraft(cleaned);
        }
      }}
      onBlur={(event) => {
        const parsed = draft === null ? null : parseIntegerInput(draft);
        if (parsed !== null) {
          const clamped = Math.min(Math.max(parsed, min), max);
          if (clamped !== value) onChange(clamped);
        }
        setDraft(null);
        onBlur?.(event);
      }}
    />
  );
}
