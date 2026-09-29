/**
 * Recursively compares two values for structural equality.
 *
 * Both values must share the same prototype (a plain object never equals an
 * array or a class instance). `Date`s are compared by timestamp, `RegExp`s by
 * source and flags, `Map`s by keys (identity) then values (deeply), and
 * `Set`s by membership (identity, like `Set.prototype.has`).
 *
 * @param a - The first value.
 * @param b - The second value.
 * @returns `true` if `a` and `b` are deeply equal.
 * @example
 * deepEqual({ a: [1, 2] }, { a: [1, 2] }); // => true
 * deepEqual({ a: 1 }, { a: 2 }); // => false
 * deepEqual(new Date(0), new Date(0)); // => true
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null ||
    Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)
  ) {
    return false;
  }

  if (a instanceof Date) {
    return Object.is(a.getTime(), (b as Date).getTime());
  }

  if (a instanceof RegExp) {
    const other = b as RegExp;
    return a.source === other.source && a.flags === other.flags;
  }

  if (a instanceof Map) {
    const other = b as Map<unknown, unknown>;
    if (a.size !== other.size) return false;
    for (const [key, value] of a) {
      if (!other.has(key) || !deepEqual(value, other.get(key))) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    const other = b as Set<unknown>;
    if (a.size !== other.size) return false;
    for (const value of a) {
      if (!other.has(value)) return false;
    }
    return true;
  }

  if (Array.isArray(a)) {
    const other = b as unknown[];
    if (a.length !== other.length) return false;
    return a.every((item, index) => deepEqual(item, other[index]));
  }

  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  return aKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  );
}
