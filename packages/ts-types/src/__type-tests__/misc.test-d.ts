import type { NonEmptyArray } from "../array/index.js";
import type { Brand } from "../brand/index.js";
import type { Maybe, Nullable } from "../common/index.js";
import type { AsyncReturnType } from "../function/index.js";
import type { UnionToTuple } from "../union/index.js";

import type { Equal, Expect } from "./assert.js";

// NonEmptyArray
export const nonEmpty: NonEmptyArray<number> = [1, 2];
// @ts-expect-error an empty array is rejected
export const empty: NonEmptyArray<number> = [];

// Brand
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
declare const userId: UserId;
export const brandedIsStillAString: string = userId;
// @ts-expect-error a plain string is not a UserId
export const plainString: UserId = "u_1";
// @ts-expect-error two different brands don't mix
export const wrongBrand: OrderId = userId;

// Nullable / Maybe
export type CommonCases = [
  Expect<Equal<Nullable<string>, string | null>>,
  Expect<Equal<Maybe<string>, string | null | undefined>>,
];

// AsyncReturnType
export type AsyncReturnTypeCases = [
  Expect<Equal<AsyncReturnType<() => Promise<{ id: number }>>, { id: number }>>,
  Expect<Equal<AsyncReturnType<(id: string) => Promise<void>>, void>>,
];
// @ts-expect-error only async functions are accepted
export type NotAsync = AsyncReturnType<() => number>;

// UnionToTuple (member order is not guaranteed, only the content)
export type UnionToTupleCases = [
  Expect<Equal<UnionToTuple<"a">, ["a"]>>,
  Expect<Equal<UnionToTuple<never>, []>>,
  Expect<Equal<UnionToTuple<"a" | "b" | "c">["length"], 3>>,
  Expect<Equal<UnionToTuple<"a" | "b">[number], "a" | "b">>,
];
