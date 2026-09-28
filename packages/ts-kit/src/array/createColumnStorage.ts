/** Minimal shape of a toggleable, reorderable column. */
export interface StorableColumn {
  key: string;
  visible: boolean;
}

export interface ColumnStorage<T extends StorableColumn> {
  serialize: (columns: readonly T[]) => string;
  deserialize: (raw: string) => T[];
}

/**
 * Creates a (de)serializer for a user-customized list of columns (order and
 * visibility), e.g. to persist a table layout in `localStorage`. Only `key`
 * and `visible` are stored; other properties (labels…) always come from
 * `defaults`. On read, unknown keys are dropped, columns missing from the
 * stored value are appended in their default order, and invalid JSON falls
 * back to `defaults`.
 *
 * @param defaults - The default columns, in their default order.
 * @returns A `{ serialize, deserialize }` pair.
 * @example
 * const storage = createColumnStorage([
 *   { key: "name", label: "Name", visible: true },
 *   { key: "email", label: "Email", visible: true },
 * ]);
 * storage.deserialize('[{"key":"email","visible":false}]');
 * // => [{ key: "email", label: "Email", visible: false },
 * //     { key: "name", label: "Name", visible: true }]
 */
export function createColumnStorage<T extends StorableColumn>(
  defaults: readonly T[],
): ColumnStorage<T> {
  function serialize(columns: readonly T[]): string {
    return JSON.stringify(
      columns.map(({ key, visible }) => ({ key, visible })),
    );
  }

  function deserialize(raw: string): T[] {
    try {
      const stored: unknown = JSON.parse(raw);
      if (!Array.isArray(stored)) return [...defaults];

      const result: T[] = [];
      for (const entry of stored as unknown[]) {
        const { key, visible } = (entry ?? {}) as Partial<StorableColumn>;
        const column = defaults.find((c) => c.key === key);
        if (!column || result.some((c) => c.key === column.key)) continue;
        result.push({
          ...column,
          visible: typeof visible === "boolean" ? visible : column.visible,
        });
      }
      for (const column of defaults) {
        if (!result.some((c) => c.key === column.key)) result.push(column);
      }
      return result;
    } catch {
      return [...defaults];
    }
  }

  return { serialize, deserialize };
}
