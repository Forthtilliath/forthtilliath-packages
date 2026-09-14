/**
 * Escapes a CSV field per RFC 4180: wraps it in double quotes and doubles any
 * internal double quote if the value contains a double quote, a semicolon
 * (the delimiter), or a newline — returned as-is otherwise.
 *
 * @param value - The raw field value.
 * @returns The value, quoted and escaped only if needed.
 * @example
 * escapeCsvField("Apple"); // => "Apple"
 * escapeCsvField("a;b"); // => '"a;b"'
 * escapeCsvField('He said "hi"'); // => '"He said ""hi"""'
 */
export function escapeCsvField(value: string): string {
  if (!/[";\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}
