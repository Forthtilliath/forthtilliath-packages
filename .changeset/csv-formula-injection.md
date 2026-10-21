---
"@forthtilliath/ts-kit": minor
---

Security: `toCsv` and `escapeCsvField` now prefix with `'` a text cell starting with `=`, `+`, `-`, `@`, a tab or a carriage return, so a spreadsheet shows it instead of running it as a formula (CSV injection). Numbers, and numbers written as text, are untouched. `{ neutralizeFormulas: false }` turns it off; `neutralizeCsvFormula` is exported on its own.
