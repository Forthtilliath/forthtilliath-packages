export interface SanitizeIntegerInputOptions {
  /**
   * Keep a leading minus sign.
   *
   * @defaultValue true
   */
  allowNegative?: boolean;
}

/**
 * Cleans what the user is typing in a whole-number field: drops every
 * character that is neither a digit nor a leading minus sign (spaces, commas,
 * dots, pasted text…), keystroke by keystroke. A lone `"-"` survives, so a
 * negative number can be typed normally — {@link parseIntegerInput} then tells
 * whether the text is a number yet.
 *
 * @param raw - The field's text, as `onChangeText` gives it.
 * @param options - See {@link SanitizeIntegerInputOptions}.
 * @returns The text with only digits, and a minus sign in first position if allowed.
 * @example
 * sanitizeIntegerInput("1 250"); // => "1250"
 * sanitizeIntegerInput("-"); // => "-"
 * sanitizeIntegerInput("12-3"); // => "123"
 * sanitizeIntegerInput("-4", { allowNegative: false }); // => "4"
 */
export function sanitizeIntegerInput(
  raw: string,
  { allowNegative = true }: SanitizeIntegerInputOptions = {},
): string {
  const digits = raw.replace(/\D/g, "");
  return allowNegative && raw.trimStart().startsWith("-")
    ? `-${digits}`
    : digits;
}
