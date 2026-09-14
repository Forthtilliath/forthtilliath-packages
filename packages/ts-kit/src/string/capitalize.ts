/**
 * Capitalizes the first character of a string and lower-cases the rest.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 * @example
 * capitalize("hello world"); // => "Hello world"
 * capitalize("HELLO"); // => "Hello"
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
