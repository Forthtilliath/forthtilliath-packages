/**
 * The whole number a field's text stands for, or `null` while it isn't one
 * yet: empty field, a lone `"-"` before the digits of a negative number,
 * `"1-2"`, a decimal, or a number too large to be represented exactly (beyond
 * `Number.MAX_SAFE_INTEGER`). The caller then keeps its last valid value
 * instead of replacing the text with `0`.
 *
 * @param raw - The field's text, ideally cleaned by `sanitizeIntegerInput`.
 * @returns The integer, or `null`.
 * @example
 * parseIntegerInput("-12"); // => -12
 * parseIntegerInput("-"); // => null
 * parseIntegerInput(""); // => null
 * parseIntegerInput("99999999999999999999"); // => null
 */
export function parseIntegerInput(raw: string): number | null {
  if (!/^-?\d+$/.test(raw)) return null;
  const value = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(value)) return null;
  // "-0" would otherwise give a negative zero, shown back as "0" but unequal
  // to 0 under Object.is (React's state comparison).
  return Object.is(value, -0) ? 0 : value;
}
