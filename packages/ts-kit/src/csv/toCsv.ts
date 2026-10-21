import {
  type CsvFormulaOptions,
  neutralizeCsvFormula,
} from "./neutralizeCsvFormula.js";

/**
 * Serializes rows to CSV. Every cell is wrapped in double quotes (any internal
 * double quote doubled), so delimiters and line breaks inside a cell are safe.
 * A text cell that would run as a spreadsheet formula (`=`, `+`, `-`, `@`…) is
 * prefixed with `'` (see `neutralizeCsvFormula`); number cells never are.
 * Rows are joined with `\n`.
 *
 * @param rows - The rows to serialize, header row included if any.
 * @param delimiter - The cell separator. Defaults to `","`.
 * @param options - `{ neutralizeFormulas }`, `true` by default.
 * @returns The CSV content.
 * @example
 * toCsv([["name", "age"], ["Ann", 32]]); // => '"name","age"\n"Ann","32"'
 * toCsv([['say "hi"']]); // => '"say ""hi"""'
 * toCsv([["=1+1", -3]]); // => `"'=1+1","-3"`
 */
export function toCsv(
  rows: readonly (readonly (string | number)[])[],
  delimiter = ",",
  { neutralizeFormulas = true }: CsvFormulaOptions = {},
): string {
  const text = (cell: string | number) =>
    typeof cell === "string" && neutralizeFormulas
      ? neutralizeCsvFormula(cell)
      : String(cell);
  return rows
    .map((row) =>
      row.map((cell) => `"${text(cell).replace(/"/g, '""')}"`).join(delimiter),
    )
    .join("\n");
}
