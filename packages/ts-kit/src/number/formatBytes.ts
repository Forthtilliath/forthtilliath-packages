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

  const exponent = Math.min(
    Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  const formatted = value.toFixed(Math.max(decimals, 0)).replace(/\.?0+$/, "");

  return `${formatted} ${UNITS[exponent]}`;
}
