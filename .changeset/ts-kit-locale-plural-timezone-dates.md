---
"@forthtilliath/ts-kit": minor
---

`pluralize` takes `{ plural?, locale? }` as third argument (a plain string still works): which counts take the singular now follows the locale's plural rules (`Intl.PluralRules`), e.g. 0 is singular in French, with a French default suffix. New `createPluralize(locale)` binds a locale once per app. New `date` helpers for servers running in UTC: `dateInTimeZone(date, timeZone)`, `todayInTimeZone(timeZone, now?)` and `daysUntil(date, timeZone, now?)` (calendar days, unaffected by the time of day or DST).
