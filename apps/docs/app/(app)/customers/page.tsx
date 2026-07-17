"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  Avatar,
  AvatarFallback,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import { DataTable } from "@forthtilliath/shadcn-ui/components/blocks/data-table";

interface Customer {
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "active" | "invited" | "suspended";
  joined: string;
}

const customers: Customer[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@acme.dev",
    plan: "Enterprise",
    status: "active",
    joined: "2024-01-12",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@acme.dev",
    plan: "Pro",
    status: "active",
    joined: "2024-02-03",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@acme.dev",
    plan: "Free",
    status: "invited",
    joined: "2024-03-21",
  },
  {
    name: "William Kim",
    email: "will@acme.dev",
    plan: "Pro",
    status: "suspended",
    joined: "2024-04-08",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@acme.dev",
    plan: "Enterprise",
    status: "active",
    joined: "2024-04-30",
  },
  {
    name: "Ethan Brown",
    email: "ethan.brown@acme.dev",
    plan: "Free",
    status: "active",
    joined: "2024-05-14",
  },
  {
    name: "Ava Wilson",
    email: "ava.wilson@acme.dev",
    plan: "Pro",
    status: "active",
    joined: "2024-06-02",
  },
  {
    name: "Noah Clark",
    email: "noah.clark@acme.dev",
    plan: "Free",
    status: "invited",
    joined: "2024-06-19",
  },
];

const statusVariant: Record<
  Customer["status"],
  "default" | "secondary" | "destructive"
> = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

const columns: ColumnDef<Customer>[] = [
  {
    // DataTable's built-in search box filters the "email" column
    // specifically, so this stays keyed on email even though the cell
    // renders the combined avatar + name + email identity.
    accessorKey: "email",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">
            {initials(row.original.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-muted-foreground text-xs">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  { accessorKey: "plan", header: "Plan" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<Customer["status"]>("status");
      return (
        <Badge variant={statusVariant[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  { accessorKey: "joined", header: "Joined" },
];

export default function CustomersPage() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-muted-foreground text-sm">
          Manage your customers and their subscriptions.
        </p>
      </div>
      <DataTable columns={columns} data={customers} />
    </>
  );
}
