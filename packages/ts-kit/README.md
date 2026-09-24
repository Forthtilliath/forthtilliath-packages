# @forthtilliath/ts-kit

Framework-agnostic TypeScript utility functions — arrays, objects, strings,
async control-flow, dates, numbers, browser file downloads, changelog/version
parsing, and a couple of `Array` extensions with better type-narrowing.

## Install

Within the workspace:

```json
{
  "dependencies": {
    "@forthtilliath/ts-kit": "workspace:*"
  }
}
```

## Usage

Import everything you need from the package root — a single barrel re-exports
every category, so there's no need to remember (or type out) one import line
per module:

```ts
import { chunk, clamp, debounce, pick, slugify } from "@forthtilliath/ts-kit";
```

Subpath imports still work if you'd rather import one module at a time (e.g.
to keep a bundle's included code obvious at a glance):

```ts
import { chunk } from "@forthtilliath/ts-kit/array/chunk";
```

### `array`

- `chunk(array, size)` — splits an array into chunks of a given size.
- `flattenDeep(array)` — recursively flattens nested arrays.
- `getMostRecentIds(rows, limit?)` — most recently occurring distinct ids
  (`{ id, occurredAt }[]`), most recent first, deduplicated, limited
  (default 5).
- `nextInCycle(ids, currentId)` — next id in a short list (e.g. cycling
  through recents on tap) — wraps to the first if `currentId` is at the end
  or no longer in the list.
- `rankByNameMatch(items, query, getName)` — ranks `items` by relevance to
  `query`: earlier match position first, then shorter name — for a
  search-as-you-type list.
- `swapItems(items, i, j)` — copy of `items` with the elements at `i` and `j`
  swapped (e.g. moving an item up/down) — a plain copy if either position is
  out of bounds.

### `async`

- `sleep(ms)` — resolves after a delay.
- `retry(fn, options)` — retries an async operation with exponential backoff.
- `debounce(fn, wait)` — delays `fn` until calls stop for `wait` ms; exposes
  `cancel()` / `flush()`.
- `throttle(fn, wait)` — runs `fn` at most once per `wait` ms (leading +
  trailing edge); exposes `cancel()`.
- `memoize(fn, getKey?)` — caches `fn`'s results per argument tuple; exposes
  the underlying `cache` map.
- `withTimeout(promise, ms, message?)` — rejects with a `TimeoutError` if
  `promise` doesn't settle in time.

### `classes`

- `FArray` — an `Array` subclass that fixes a handful of spots where the
  native `Array` typings are wrong or overly restrictive:
  - `includes()` narrows the type of the searched value when it's found
    (the native `Array.prototype.includes` only narrows the _array's_
    element type).
  - `indexOf()` / `lastIndexOf()` accept a search value outside of the
    array's element type instead of rejecting it at compile-time (same
    root cause as `includes`, fixed the same way).
  - `filter(Boolean)` strips `null`/`undefined` from the result's type
    (the native typings don't recognize `Boolean` as a type guard, so the
    result keeps the nullish types even though they're removed at runtime).
  - `FArray.from(...)` / `FArray.of(...)` are typed to return an `FArray`
    instead of a plain array (the native static typings return a plain
    array even though these methods already construct an instance of the
    calling class at runtime).
  - `toArray()` converts an `FArray` back into a plain `Array` instance —
    rarely needed since `FArray` is already assignable to `T[]` anywhere a
    plain array is expected, but useful when the runtime type matters too.

### `csv`

- `parseCsvLine(line, delimiter?)` — splits one CSV line into trimmed cells;
  quoted cells may contain the delimiter, `""` stands for a literal quote.
  Delimiter defaults to `","`.
- `toCsv(rows, delimiter?)` — serializes rows to CSV, every cell quoted and
  escaped, rows joined with `\n`.
- `downloadCsv(filename, content)` — browser download as `text/csv`, with a
  UTF-8 BOM so Excel reads accented characters.

### `date`

- `startOfDay(date?)` — returns a new `Date` at local midnight.
- `isSameDay(a, b)` — checks whether two dates fall on the same local day.
- `formatRelativeTime(date, baseDate?, locale?)` — human-readable relative
  time ("3 hours ago"), backed by `Intl.RelativeTimeFormat`.
- `getPeriodStartMs(period, now?)` — start timestamp (ms) for a
  `"today" | "7d" | "30d" | "all"` period filter, or `null` for `"all"`.
  `"today"` is the current calendar day, not a rolling 24h window.

### `files`

- `downloadText(filename, text)` — triggers a browser download of a text file
  via a `data:` URI.
- `downloadTextBlob(filename, text)` — same, but via a `Blob` + object URL
  (better for larger content).

### `id`

- `randomId()` — `crypto.randomUUID()` with fallbacks for older/insecure
  contexts.

### `image`

- `compressImage(file, { maxWidth?, quality? })` — browser-side compression
  via the Canvas API: scales down to `maxWidth` (default 2400px, aspect ratio
  kept) and converts to WebP (default quality 0.82). Non-image files are
  returned unchanged.

### `markdown`

- `parseChangelogNotes(notes)` — parses a small subset of Markdown
  (`### heading`, `- item`, `**bold**`) commonly found in GitHub release
  notes into a list of typed blocks (`heading` / `item` / `text`, each with
  `bold`-aware segments), ready for a UI layer to render without a full
  Markdown dependency.

### `maths`

- `sum(numbers)` — sum of an array of numbers.
- `avg(numbers)` — average of an array of numbers.

### `number`

- `clamp(value, min, max)` — clamps a number between two bounds.
- `round(value, decimals?)` — rounds to a given number of decimal places.
- `formatBytes(bytes, decimals?)` — human-readable byte size ("1.5 MB").
- `formatDuration(ms)` — human-readable duration ("1d 1h 1m 1s").
- `formatCsvNumber(value, decimals?)` — formats a number with a comma
  decimal separator (French-locale spreadsheets) instead of JS's dot.

### `object`

- `pick(obj, keys)` / `omit(obj, keys)` — keep or drop a set of keys.
- `groupBy(array, getKey)` — groups elements by a computed key.
- `uniqueBy(array, getKey)` — deduplicates elements by a computed key.
- `deepClone(value)` — deep clone (via `structuredClone`, with a JSON
  fallback).
- `deepEqual(a, b)` — recursive structural equality check.
- `mapValues(obj, fn)` — maps every value of an object through `fn`.

### `string`

- `capitalize(str)` — uppercases the first letter, lowercases the rest.
- `truncate(str, maxLength, suffix?)` — truncates with an ellipsis (or custom
  suffix).
- `slugify(str)` — URL-friendly slug (accents stripped, lower-cased,
  hyphenated).
- `pluralize(count, singular, plural?)` — naive English pluralization, with an
  override for irregular words.
- `normalizeForSearch(text)` — lowercases, trims, strips accents, and expands
  œ/æ ligatures (which `normalize("NFD")` alone doesn't decompose) — for
  accent/case-insensitive search matching.
- `escapeCsvField(value)` — quotes and escapes a CSV field (RFC 4180) only if
  it contains a `"`, `;`, or newline.
- `escapeHtml(text)` — basic HTML entity escaping (`&`, `<`, `>`, `"`) for
  inserting user text into an HTML template.

### `version`

- `compareVersions(a, b)` — compares two `"x.y.z"` version strings, segment
  by segment; `-1`/`0`/`1`.

## Scripts

```bash
pnpm run build          # tsc -> dist/ (excludes *.test.ts)
pnpm run dev             # tsc --watch, same exclusion
pnpm run check-types     # tsc --noEmit, includes test files
pnpm run lint            # eslint
pnpm run test            # vitest run
```

Type-checking and building use different `tsconfig`s on purpose:
`tsconfig.json` includes `*.test.ts` (so lint/check-types see them),
`tsconfig.build.json` excludes them (so they never end up in `dist/`).
