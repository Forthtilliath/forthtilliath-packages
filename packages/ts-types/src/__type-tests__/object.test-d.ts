import type {
  DeepPartial,
  DeepReadonly,
  Entries,
  KeysMatching,
  Merge,
  Prettify,
  RecordValues,
} from "../object/index.js";

import type { Equal, Expect } from "./assert.js";

interface User {
  id: number;
  name: string;
  address: { city: string; zip: string };
  tags: { label: string }[];
  greet: () => string;
}

export type DeepPartialCases = [
  Expect<
    Equal<
      DeepPartial<User>["address"],
      { city?: string; zip?: string } | undefined
    >
  >,
  Expect<Equal<DeepPartial<User>["tags"], { label?: string }[] | undefined>>,
  // Functions are kept as-is, not turned into an object of optional keys.
  Expect<Equal<DeepPartial<User>["greet"], (() => string) | undefined>>,
];

export const deepPartialAcceptsNestedSubset: DeepPartial<User> = {
  address: { city: "Paris" },
};

export type DeepReadonlyCases = [
  Expect<
    Equal<
      DeepReadonly<User>["address"],
      { readonly city: string; readonly zip: string }
    >
  >,
  Expect<
    Equal<DeepReadonly<User>["tags"], readonly { readonly label: string }[]>
  >,
];

declare const frozen: DeepReadonly<User>;
// @ts-expect-error nested properties are readonly
frozen.address.city = "Lyon";

export type EntriesCases = [
  Expect<Equal<Entries<{ a: 1; b: "x" }>, readonly (["a", 1] | ["b", "x"])[]>>,
];

export type KeysMatchingCases = [
  Expect<Equal<KeysMatching<User, string>, "name">>,
  // An optional key's value type includes `undefined`, so it only matches a
  // `V` that accepts `undefined` too.
  Expect<
    Equal<KeysMatching<{ a?: number; b: number; c: string }, number>, "b">
  >,
];

export type MergeCases = [
  // `S` overrides a property `F` declares with an incompatible type (a plain
  // `F & S` would turn it into `never`).
  Expect<
    Equal<
      Merge<{ a: number; b: string }, { b: boolean }>,
      { a: number; b: boolean }
    >
  >,
  // Optional and readonly modifiers are kept.
  Expect<
    Equal<
      Merge<{ a?: number }, { readonly b: string }>,
      { a?: number; readonly b: string }
    >
  >,
];

// Aliased so each `@ts-expect-error` target stays on a single line.
type Merged = Merge<{ a: number; b: string }, { b: boolean }>;
// @ts-expect-error `b` now has `S`'s type
export const mergedRejectsOverriddenType: Merged = { a: 1, b: "x" };
// @ts-expect-error every property is still required
export const mergedRejectsMissingKey: Merged = { a: 1 };

export type PrettifyCases = [
  Expect<Equal<Prettify<{ a: 1 } & { b: 2 }>, { a: 1; b: 2 }>>,
];

export type RecordValuesCases = [
  Expect<Equal<RecordValues<{ a: 1; b: "x" }>, 1 | "x">>,
];
