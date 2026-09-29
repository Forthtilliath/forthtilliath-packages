// `memoize` isn't async-specific: it moved to `function/`. Re-exported here so
// the `@forthtilliath/ts-kit/async/memoize` deep import keeps working.

/** @deprecated Import from `@forthtilliath/ts-kit/function/memoize` instead. */
export {
  memoize,
  type MemoizedFunction,
  type MemoizeOptions,
} from "../function/memoize.js";
