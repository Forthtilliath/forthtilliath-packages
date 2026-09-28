import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ColumnMenuColumn } from "@forthtilliath/forth-ui/components/column-menu";
import { ColumnMenu } from "@forthtilliath/forth-ui/components/column-menu";

const DEFAULT_COLUMNS: ColumnMenuColumn[] = [
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "phone", label: "Phone", visible: true },
  { key: "city", label: "City", visible: false },
];

/**
 * A dropdown to show/hide and reorder the columns of a table.
 */
const meta = {
  title: "forth-ui/Data Display/ColumnMenu",
  component: ColumnMenu,
  args: {
    columns: DEFAULT_COLUMNS,
    defaultColumns: DEFAULT_COLUMNS,
    onColumnsChange: () => undefined,
  },
} satisfies Meta<typeof ColumnMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

function ColumnMenuExample({
  labels,
}: Pick<React.ComponentProps<typeof ColumnMenu>, "labels">) {
  const [columns, setColumns] = React.useState(DEFAULT_COLUMNS);
  const visible = columns.filter((c) => c.visible);

  return (
    <div className="flex w-md flex-col gap-4">
      <div className="flex justify-end">
        <ColumnMenu
          columns={columns}
          defaultColumns={DEFAULT_COLUMNS}
          onColumnsChange={setColumns}
          labels={labels}
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            {visible.map((c) => (
              <th key={c.key} className="border-b p-2 text-left">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}

/**
 * Toggle columns, drag them by their handle (mouse, touch or keyboard), or
 * reset the layout.
 */
export const Default: Story = {
  render: () => <ColumnMenuExample />,
};

/**
 * Every text can be translated through `labels`.
 */
export const Translated: Story = {
  render: () => (
    <ColumnMenuExample
      labels={{
        trigger: "Colonnes",
        title: "Colonnes affichées",
        reset: "Réinitialiser",
        hint: "Glisser pour réordonner · interrupteur pour afficher/masquer",
        dragHandle: (label) => `Déplacer la colonne ${label}`,
      }}
    />
  ),
};
