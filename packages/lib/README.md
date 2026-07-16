# @forthtilliath/lib

Framework-agnostic TypeScript utility functions — arrays, maths, browser file
downloads, and a couple of `Array` extensions with better type-narrowing.

> **Status**: not currently consumed by any other package in this monorepo.
> Built, linted, tested and type-checked like everything else, but nothing
> imports it yet.

## Install

Within the workspace:

```json
{
  "dependencies": {
    "@forthtilliath/lib": "workspace:*"
  }
}
```

## Usage

Each module is exported individually — import the file you need directly
rather than a single barrel:

```ts
import { chunk } from "@forthtilliath/lib/array/chunk";
import { flattenDeep } from "@forthtilliath/lib/array/flattenDeep";
import { FArray } from "@forthtilliath/lib/classes/array";
import {
  downloadText,
  downloadTextBlob,
} from "@forthtilliath/lib/files/downloadText";
import { avg } from "@forthtilliath/lib/maths/average";
import { sum } from "@forthtilliath/lib/maths/sum";
```

### `array`

- `chunk(array, size)` — splits an array into chunks of a given size.
- `flattenDeep(array)` — recursively flattens nested arrays.

### `classes`

- `FArray` — an `Array` subclass whose `includes()` narrows the type of the
  searched value when it's found (unlike the native `Array.prototype.includes`,
  which only narrows the _array's_ element type).

### `files`

- `downloadText(filename, text)` — triggers a browser download of a text file
  via a `data:` URI.
- `downloadTextBlob(filename, text)` — same, but via a `Blob` + object URL
  (better for larger content).

### `maths`

- `sum(numbers)` — sum of an array of numbers.
- `avg(numbers)` — average of an array of numbers.

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
