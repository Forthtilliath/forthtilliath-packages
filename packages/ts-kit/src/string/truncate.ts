/**
 * Truncates a string to a maximum length, appending a suffix when it was cut.
 *
 * @param str - The string to truncate.
 * @param maxLength - The maximum length of the result, suffix included.
 * @param suffix - Appended when the string is truncated (defaults to `"…"`).
 * @returns `str` unchanged if it already fits, otherwise the truncated string.
 * @example
 * truncate("Hello world", 8); // => "Hello w…"
 * truncate("Hi", 8); // => "Hi"
 */
export function truncate(str: string, maxLength: number, suffix = "…"): string {
  if (str.length <= maxLength) return str;
  const sliceLength = Math.max(0, maxLength - suffix.length);
  return str.slice(0, sliceLength) + suffix;
}
