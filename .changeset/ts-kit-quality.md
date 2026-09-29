---
"@forthtilliath/ts-kit": minor
"@forthtilliath/react-native-kit": patch
---

ts-kit quality pass:

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
