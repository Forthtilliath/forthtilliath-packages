/** Octets taken by one code point in UTF-8. */
function utf8Length(codePoint: number): number {
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  if (codePoint < 0x10000) return 3;
  return 4;
}

/**
 * Folds an iCalendar (RFC 5545) content line longer than 75 **octets**: the
 * rest goes on continuation lines (CRLF + one space), each 75 octets at most
 * including that space. Counts UTF-8 bytes, not characters — an accented
 * line folded at 75 characters would overflow — and never splits a
 * multi-byte character.
 *
 * @param line - One unfolded content line, without its line break.
 * @param maxOctets - Octets per line. @defaultValue 75
 * @returns The line, folded with `\r\n ` where needed.
 * @example
 * foldIcsLine(`DESCRIPTION:${"é".repeat(40)}`); // => 2 lines
 */
export function foldIcsLine(line: string, maxOctets = 75): string {
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const bytes = utf8Length(char.codePointAt(0) ?? 0);
    if (size + bytes > maxOctets) {
      parts.push(current);
      current = " ";
      size = 1;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join("\r\n");
}
