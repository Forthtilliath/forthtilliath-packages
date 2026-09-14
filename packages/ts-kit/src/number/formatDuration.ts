/**
 * Formats a duration in milliseconds as a human-readable string
 * (`"1d 1h 1m 1s"`, `"500ms"`).
 *
 * @param ms - The duration in milliseconds.
 * @returns The formatted string.
 * @example
 * formatDuration(90_061_000); // => "1d 1h 1m 1s"
 * formatDuration(500); // => "500ms"
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}
