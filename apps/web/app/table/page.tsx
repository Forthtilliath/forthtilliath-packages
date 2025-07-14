import { DataTable } from "@forthtilliath/shadcn-ui/components/blocks/data-table";

import { columns } from "./columns";

export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

async function getData(): Promise<Payment[]> {
  return Promise.resolve([
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
    {
      id: "a2a2a2a2",
      amount: 333,
      status: "success",
      email: "jane@example.com",
    },
    {
      id: "w2w2w2w2",
      amount: 444,
      status: "failed",
      email: "jack@example.com",
    },
    {
      id: "e2e2e2e2",
      amount: 555,
      status: "pending",
      email: "amy@example.com",
    },
    {
      id: "r2r2r2r2",
      amount: 666,
      status: "success",
      email: "frank@example.com",
    },
    {
      id: "t2t2t2t2",
      amount: 777,
      status: "processing",
      email: "samantha@example.com",
    },
    {
      id: "y2y2y2y2",
      amount: 888,
      status: "failed",
      email: "lucy@example.com",
    },
    {
      id: "u2u2u2u2",
      amount: 999,
      status: "pending",
      email: "olivia@example.com",
    },
  ]);
}

export default async function TablePage() {
  const payments = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments} config={{
        enablePagination: false
      }} />
    </div>
  );
}
