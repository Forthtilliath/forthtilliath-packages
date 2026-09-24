---
"@forthtilliath/ts-kit": minor
---

Add a `csv` category: `parseCsvLine(line, delimiter?)` splits a line into trimmed cells (quoted cells, doubled quotes), `toCsv(rows, delimiter?)` serializes rows with every cell quoted, and `downloadCsv(filename, content)` downloads it with a UTF-8 BOM for Excel.
