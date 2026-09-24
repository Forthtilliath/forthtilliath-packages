/**
 * Splits a single CSV line into its cells. A cell wrapped in double quotes may
 * contain the delimiter, and a doubled double quote (`""`) inside it stands for
 * a literal one. Every cell is trimmed.
 *
 * @param line - One line of CSV (no line break).
 * @param delimiter - The cell separator. Defaults to `","`.
 * @returns The cells of the line, unquoted and trimmed.
 * @example
 * parseCsvLine('a, "b, c" ,d'); // => ["a", "b, c", "d"]
 * parseCsvLine('"He said ""hi"""'); // => ['He said "hi"']
 * parseCsvLine("a;b", ";"); // => ["a", "b"]
 */
export function parseCsvLine(line: string, delimiter = ","): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i);
    if (ch === '"') {
      if (inQuotes && line.charAt(i + 1) === '"') {
        current += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}
