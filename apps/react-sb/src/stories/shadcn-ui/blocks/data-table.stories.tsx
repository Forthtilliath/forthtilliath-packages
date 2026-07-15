import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { DataTable } from "@forthtilliath/shadcn-ui/components/blocks/data-table";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/dropdown-menu";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

const payments: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  {
    id: "9q2q2q2p",
    amount: 111,
    status: "pending",
    email: "sarah@example.com",
  },
  {
    id: "q2q2q2q2",
    amount: 222,
    status: "processing",
    email: "john@example.com",
  },
  { id: "a2a2a2a2", amount: 333, status: "success", email: "jane@example.com" },
  { id: "w2w2w2w2", amount: 444, status: "failed", email: "jack@example.com" },
  { id: "e2e2e2e2", amount: 555, status: "pending", email: "amy@example.com" },
];

const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

/**
 * A data table built on TanStack Table with sorting, row selection, column
 * visibility and pagination baked in. This is the "batteries included"
 * table block used by `apps/web/app/table` — for a bare table with no
 * built-in features, use the lower-level `Table` primitive instead.
 */
const meta = {
  title: "shadcn-ui-blocks/DataTable",
  component: DataTable<Payment>,
  tags: ["autodocs"],
  argTypes: {
    config: {
      description:
        "Only `enablePagination` is wired up today — the rest of `TableConfig` (search, column filters, export, ...) is scaffolded but not implemented yet.",
      control: { type: "object" },
      table: {
        type: { summary: "Partial<TableConfig>" },
        defaultValue: { summary: "{ enablePagination: true }" },
      },
    },
  },
  args: {
    columns,
    data: payments,
  },
} satisfies Meta<typeof DataTable<Payment>>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Sortable email column, row selection checkboxes, a column-visibility
 * dropdown and pagination controls, all enabled by default.
 */
export const Default: Story = {};

/**
 * Set `config.enablePagination` to `false` to render every row without a
 * pager — this is how `apps/web/app/table` currently uses the component.
 */
export const WithoutPagination: Story = {
  args: {
    config: { enablePagination: false },
  },
};

/**
 * With no rows, the table falls back to a centered "No results." message
 * instead of an empty body.
 */
export const Empty: Story = {
  args: {
    data: [],
  },
};
