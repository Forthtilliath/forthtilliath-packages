import { File, Paths } from "expo-file-system";

import { shareFile, type ShareFileOptions } from "./shareFile.js";

/**
 * Writes text to a file in the app's cache (replacing any previous one of
 * that name), then opens the native share sheet for it — to export an
 * `.ics`, a `.csv`, a JSON backup… Needs `expo-file-system` and
 * `expo-sharing` (optional peer dependencies).
 *
 * @param filename - The shared file's name, extension included.
 * @param content - Its text content.
 * @param options - See `ShareFileOptions`.
 * @throws An `Error` with a user-facing message when sharing isn't available.
 * @example
 * await shareTextFile("planning-2026-07.ics", ics, { mimeType: "text/calendar" });
 */
export async function shareTextFile(
  filename: string,
  content: string,
  options: ShareFileOptions,
): Promise<void> {
  const file = new File(Paths.cache, filename);
  if (file.exists) file.delete();
  file.create({ overwrite: true });
  file.write(content);
  await shareFile(file.uri, options);
}
