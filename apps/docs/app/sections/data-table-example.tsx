"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@forthtilliath/shadcn-ui/components/blocks/data-table";

import { Demo, Section } from "../section";

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
    email: "abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "pending",
    email: "silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("amount")),
  },
];

export function DataTableExampleSection() {
  return (
    <Section
      id="data-table"
      title="Data Table"
      description="blocks/data-table.tsx wraps TanStack Table with sorting, filtering and pagination."
    >
      <Demo label="Data table" className="block">
        <DataTable columns={columns} data={payments} />
      </Demo>
    </Section>
  );
}
