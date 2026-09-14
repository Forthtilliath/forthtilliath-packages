# @forthtilliath/ts-kit

Framework-agnostic TypeScript utility functions — arrays, objects, strings,
async control-flow, dates, numbers, browser file downloads, and a couple of
`Array` extensions with better type-narrowing.

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

- `FArray` — an `Array` subclass whose `includes()` narrows the type of the
  searched value when it's found (unlike the native `Array.prototype.includes`,
  which only narrows the _array's_ element type).

### `date`

- `startOfDay(date?)` — returns a new `Date` at local midnight.
- `isSameDay(a, b)` — checks whether two dates fall on the same local day.
- `formatRelativeTime(date, baseDate?, locale?)` — human-readable relative
  time ("3 hours ago"), backed by `Intl.RelativeTimeFormat`.

### `files`

- `downloadText(filename, text)` — triggers a browser download of a text file
  via a `data:` URI.
- `downloadTextBlob(filename, text)` — same, but via a `Blob` + object URL
  (better for larger content).

### `id`

- `randomId()` — `crypto.randomUUID()` with fallbacks for older/insecure
  contexts.

### `maths`

- `sum(numbers)` — sum of an array of numbers.
- `avg(numbers)` — average of an array of numbers.

### `number`

- `clamp(value, min, max)` — clamps a number between two bounds.
- `round(value, decimals?)` — rounds to a given number of decimal places.
- `formatBytes(bytes, decimals?)` — human-readable byte size ("1.5 MB").
- `formatDuration(ms)` — human-readable duration ("1d 1h 1m 1s").

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
