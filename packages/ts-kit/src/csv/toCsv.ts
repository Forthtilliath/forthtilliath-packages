/**
 * Serializes rows to CSV. Every cell is wrapped in double quotes (any internal
 * double quote doubled), so delimiters and line breaks inside a cell are safe.
 * Rows are joined with `\n`.
 *
 * @param rows - The rows to serialize, header row included if any.
 * @param delimiter - The cell separator. Defaults to `","`.
 * @returns The CSV content.
 * @example
 * toCsv([["name", "age"], ["Ann", 32]]); // => '"name","age"\n"Ann","32"'
 * toCsv([['say "hi"']]); // => '"say ""hi"""'
 */
export function toCsv(
  rows: readonly (readonly (string | number)[])[],
  delimiter = ",",
): string {
  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(delimiter),
    )
    .join("\n");
}
