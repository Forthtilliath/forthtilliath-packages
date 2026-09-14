---
"@forthtilliath/ts-kit": minor
---

Added `escapeCsvField`/`escapeHtml`/`normalizeForSearch` to `string`, `formatCsvNumber` to `number`, `getMostRecentIds`/`nextInCycle`/`rankByNameMatch` to `array`, and `getPeriodStartMs` to `date`. All are exported from the root barrel and from their own `@forthtilliath/ts-kit/<category>` subpath. Extracted from `@forthtilliath/react-native-kit`, which had no React Native dependency on them.
