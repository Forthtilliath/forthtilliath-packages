const UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

/**
 * Formats a byte count as a human-readable string (`"1.5 MB"`).
 *
 * @param bytes - The number of bytes.
 * @param decimals - The number of decimal places to keep (default: 2).
 * @returns The formatted string.
 * @example
 * formatBytes(1536); // => "1.5 KB"
 * formatBytes(0); // => "0 B"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";

  // Clamped at 0 so a fraction of a byte stays in "B" (a negative exponent
  // has no unit).
  const exponent = Math.max(
    0,
    Math.min(
      Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
      UNITS.length - 1,
    ),
  );
  const value = bytes / 1024 ** exponent;
  // Round-tripping through Number drops trailing decimal zeros ("1.50" →
  // "1.5") without touching the integer part ("100" stays "100").
  const formatted = String(Number(value.toFixed(Math.max(decimals, 0))));

  return `${formatted} ${UNITS[exponent]}`;
}
