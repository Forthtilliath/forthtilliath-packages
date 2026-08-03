import type { UnknownRecord } from "./unknown-record.js";

/** Enforces the exact shape of an object */
export type ExactRecord<T extends UnknownRecord> = {
  [K in keyof T]: T[K];
};
