import { downloadTextBlob } from "../files/downloadText.js";

/**
 * Downloads CSV content as a file. Prepends a UTF-8 byte order mark so Excel
 * reads accented characters correctly instead of guessing a legacy encoding.
 *
 * @param filename - The filename to save to.
 * @param content - The CSV content (see `toCsv`).
 * @example
 * downloadCsv("members.csv", toCsv([["name"], ["Zoé"]]));
 */
export function downloadCsv(filename: string, content: string): void {
  downloadTextBlob(filename, "﻿" + content, "text/csv");
}
