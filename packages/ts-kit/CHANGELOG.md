# @forthtilliath/ts-kit

## 0.11.0

### Minor Changes

- d26f492: `pluralize` takes `{ plural?, locale? }` as third argument (a plain string still works): which counts take the singular now follows the locale's plural rules (`Intl.PluralRules`), e.g. 0 is singular in French, with a French default suffix. New `createPluralize(locale)` binds a locale once per app. New `date` helpers for servers running in UTC: `dateInTimeZone(date, timeZone)`, `todayInTimeZone(timeZone, now?)` and `daysUntil(date, timeZone, now?)` (calendar days, unaffected by the time of day or DST).
- cae6bd0: ts-kit quality pass:

  - `retry`: new `shouldRetry(error, attempt)`, `maxDelayMs` and `signal` options. **Behavior change**: `onRetry` is now only called before an actual retry, no longer after the last failed attempt.
  - `withTimeout`: accepts a function `(signal) => promise` to also cancel the operation on timeout (the promise form still works).
  - `sleep(ms, signal?)`: can be cancelled.
  - `memoize`: moved to `function/`; evicts a rejected promise so the next call retries; new `{ getKey, maxSize }` options (LRU eviction beyond `maxSize`). Still importable from `async/memoize` (deprecated).
  - `flattenDeep`: typed as the innermost element type (`number[][][]` → `number[]`).
  - `escapeHtml`: also escapes `'` (safe in attributes quoted with `'`).
  - `escapeCsvField`: new `delimiter` parameter (default `;`, unchanged) and quotes values containing `\r`.
  - `downloadTextBlob`: revokes the object URL 40 s after the click instead of immediately, which could cancel the download in Firefox/Safari.
  - `sum`/`avg` moved from `maths/` to `number/`, `escapeCsvField`/`formatCsvNumber` to `csv/`; the former deep imports still work (deprecated). `avg([])` returning `NaN` is now documented.
  - README lists the browser-only functions.

### Patch Changes

- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.
- ccdad7c: Bug fixes:

  - `deepEqual`: `Date`s (by timestamp), `RegExp`s, `Map`s and `Set`s are now actually compared (they were always equal, having no own keys); a key missing from the other object is no longer treated as `undefined` (`{ a: undefined }` vs `{ b: undefined }` was `true`); values with different prototypes are no longer equal.
  - `compareVersions`: follows semver precedence for pre-releases (`1.0.0-beta.2` < `1.0.0-beta.10` < `1.0.0`) instead of returning `-1` both ways; ignores a leading `v` and build metadata.
  - `formatBytes`: a fraction of a byte is formatted in `B` (was `"512 undefined"` for `0.5`), and `decimals: 0` no longer strips the integer part's zeros (`formatBytes(100, 0)` was `"1 B"`).

## 0.10.0

### Minor Changes

- a2b9dee: Add `sanitizeFileName(name)` to the `files` category, `padNumber(n, total, minWidth?)` to the `number` category and `createColumnStorage(defaults)` to the `array` category (persists a user-customized column list: order and visibility).

## 0.9.0

### Minor Changes

- d8e0863: Add `sortUpcomingFirst(items, getDates, { now? })` to the `array` category: upcoming items first (nearest first), then past ones (most recent first), undated last. Items may carry several dates.

## 0.8.0

### Minor Changes

- 09787a7: Add a `csv` category: `parseCsvLine(line, delimiter?)` splits a line into trimmed cells (quoted cells, doubled quotes), `toCsv(rows, delimiter?)` serializes rows with every cell quoted, and `downloadCsv(filename, content)` downloads it with a UTF-8 BOM for Excel.

## 0.7.0

### Minor Changes

- e2d621a: Add `swapItems(items, i, j)` to the `array` category: returns a copy of `items` with the elements at `i` and `j` swapped, or a plain copy if either position is out of bounds.

## 0.6.0

### Minor Changes

- 9d0e8c6: New package `@forthtilliath/r2`: direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible storage) via presigned URLs — `uploadViaPresignedUrl` (`./client`, dependency-free), `createR2Client`, `createPresignHandler` (a Fetch API `Request → Response` route handler with an `authorize` hook) and `isSafeKey` (`./server`, AWS SDK as peer dependencies), plus the shared `PresignRequest`/`PresignResponse` types at the root. Extracted from the Chœur des Anjoués site. `ts-kit` gains an `image` category with `compressImage` (browser-side Canvas resize + WebP conversion), extracted from the same project.

## 0.5.0

### Minor Changes

- 05f2fa3: Moved `compareVersions` (new `version/` category) and `parseChangelogNotes` (new `markdown/` category) from `@forthtilliath/expo-release-updates` into `@forthtilliath/ts-kit` — both were 100% framework-agnostic. `expo-release-updates` now re-exports them from `ts-kit`, so its public API (root barrel and `@forthtilliath/expo-release-updates/compareVersions` / `.../parseChangelogNotes` deep imports) is unchanged.

## 0.4.0

### Minor Changes

- 2932cc7: Added `escapeCsvField`/`escapeHtml`/`normalizeForSearch` to `string`, `formatCsvNumber` to `number`, `getMostRecentIds`/`nextInCycle`/`rankByNameMatch` to `array`, and `getPeriodStartMs` to `date`. All are exported from the root barrel and from their own `@forthtilliath/ts-kit/<category>` subpath. Extracted from `@forthtilliath/react-native-kit`, which had no React Native dependency on them.

## 0.3.0

### Minor Changes

- e069c34: Added `object` (`pick`, `omit`, `groupBy`, `uniqueBy`, `deepClone`, `deepEqual`, `mapValues`), `string` (`capitalize`, `truncate`, `slugify`, `pluralize`), `async` (`sleep`, `retry`, `debounce`, `throttle`, `memoize`, `withTimeout`), `date` (`startOfDay`, `isSameDay`, `formatRelativeTime`) and `number` (`clamp`, `round`, `formatBytes`, `formatDuration`) categories. Added a root barrel (`import { chunk, pick, sleep } from "@forthtilliath/ts-kit"`) so consumers no longer need one import per sub-module. `FArray` gained `indexOf`/`lastIndexOf` (accept a search value outside of the element type, like `includes`), a `filter(Boolean)` overload that strips `null`/`undefined` from the result's type, `FArray.from`/`FArray.of` static overrides typed to return `FArray` instead of a plain array, and `toArray()` to convert back to a plain `Array`.

## 0.2.0

### Minor Changes

- 0b0c639: Added `randomId` (`crypto.randomUUID()` with a fallback for older/insecure contexts). `downloadTextBlob` now accepts an optional `mimeType` parameter (defaults to `"text/plain"`) and appends `;charset=utf-8` to the blob type.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/lib` to mirror `@forthtilliath/react-native-kit`/`@forthtilliath/react-kit`'s naming — no code changes.
