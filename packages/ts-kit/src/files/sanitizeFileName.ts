/**
 * Makes a string safe to use as a file name: characters forbidden on Windows
 * (`\ / : * ? " < > |`) become hyphens, whitespace runs collapse into a single
 * space and the result is trimmed. Also prevents a `/` from creating a
 * sub-folder inside a ZIP archive.
 *
 * @param name - The raw file name.
 * @returns The sanitized file name.
 * @example
 * sanitizeFileName("AC/DC: Live?"); // => "AC-DC- Live-"
 * sanitizeFileName("  My   file "); // => "My file"
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
