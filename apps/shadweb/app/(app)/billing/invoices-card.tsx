"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { CalendarDatePicker } from "@forthtilliath/shadcn-ui/components/blocks/calendar-date-picker";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@forthtilliath/shadcn-ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forthtilliath/shadcn-ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@forthtilliath/shadcn-ui/components/table";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

const invoices = [
  { id: "INV-2024-06", date: "2024-06-01", amount: "$29.00", status: "Paid" },
  { id: "INV-2024-05", date: "2024-05-01", amount: "$29.00", status: "Paid" },
  { id: "INV-2024-04", date: "2024-04-01", amount: "$29.00", status: "Paid" },
];

export function InvoicesCard() {
  const [exportRange, setExportRange] = useState(() => ({
    from: new Date(2024, 0, 1),
    to: new Date(),
  }));

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download past invoices.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="usd">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
            </SelectContent>
          </Select>
          <CalendarDatePicker
            date={exportRange}
            onDateSelect={setExportRange}
            variant="outline"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toast(`Downloading ${invoice.id}`);
                    }}
                  >
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
