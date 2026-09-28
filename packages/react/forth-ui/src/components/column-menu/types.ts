/** A table column the user can show/hide and reorder. */
export interface ColumnMenuColumn<K extends string = string> {
  key: K;
  label: string;
  visible: boolean;
}

/** Texts displayed by `ColumnMenu` (English by default). */
export interface ColumnMenuLabels {
  /** Trigger button text (hidden on small screens). */
  trigger: string;
  /** Menu title. */
  title: string;
  /** Reset button text. */
  reset: string;
  /** Usage hint under the title. */
  hint: string;
  /** Tooltip / accessible name of a row's drag handle. */
  dragHandle: (label: string) => string;
}

export const DEFAULT_COLUMN_MENU_LABELS: ColumnMenuLabels = {
  trigger: "Columns",
  title: "Visible columns",
  reset: "Reset",
  hint: "Drag to reorder · toggle to show/hide",
  dragHandle: (label) => `Move column ${label}`,
};
