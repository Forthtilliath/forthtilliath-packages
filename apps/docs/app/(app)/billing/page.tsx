"use client";

import { useState } from "react";
import { AlertTriangle, Download } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@forthtilliath/shadcn-ui/components/alert-dialog";
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
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@forthtilliath/shadcn-ui/components/pagination";
import { Progress } from "@forthtilliath/shadcn-ui/components/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@forthtilliath/shadcn-ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forthtilliath/shadcn-ui/components/select";
import { Slider } from "@forthtilliath/shadcn-ui/components/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@forthtilliath/shadcn-ui/components/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@forthtilliath/shadcn-ui/components/toggle-group";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

const plans = [
  { value: "free", label: "Free", price: "$0/mo" },
  { value: "pro", label: "Pro", price: "$29/mo" },
  { value: "enterprise", label: "Enterprise", price: "$99/mo" },
];

const invoices = [
  { id: "INV-2024-06", date: "2024-06-01", amount: "$29.00", status: "Paid" },
  { id: "INV-2024-05", date: "2024-05-01", amount: "$29.00", status: "Paid" },
  { id: "INV-2024-04", date: "2024-04-01", amount: "$29.00", status: "Paid" },
];

export default function BillingPage() {
  const [currentPlan] = useState("pro");
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [cycle, setCycle] = useState("monthly");
  const [exportRange, setExportRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  function handlePlanChange(value: string) {
    const currentIndex = plans.findIndex((p) => p.value === currentPlan);
    const nextIndex = plans.findIndex((p) => p.value === value);
    if (nextIndex < currentIndex) {
      setPendingPlan(value);
      setConfirmOpen(true);
      return;
    }
    setSelectedPlan(value);
  }

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm">
          Manage your subscription, usage and invoices.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Your card is expiring soon</AlertTitle>
        <AlertDescription>
          The card ending in 4242 expires at the end of this month. Update your
          payment method to avoid service interruption.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
            <CardDescription>
              Choose the plan that fits your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
              {plans.map((plan) => (
                <div key={plan.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={plan.value}
                    id={`plan-${plan.value}`}
                  />
                  <Label
                    htmlFor={`plan-${plan.value}`}
                    className="flex flex-1 justify-between font-normal"
                  >
                    <span>{plan.label}</span>
                    <span className="text-muted-foreground">{plan.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <ToggleGroup
              type="single"
              value={cycle}
              onValueChange={(value) => {
                if (value) setCycle(value);
              }}
              variant="outline"
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="yearly">Yearly (-20%)</ToggleGroupItem>
            </ToggleGroup>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Current billing period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>API calls</span>
                <span className="text-muted-foreground">72,400 / 100,000</span>
              </div>
              <Progress value={72} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">4.1 GB / 10 GB</span>
              </div>
              <Progress value={41} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>Seats</span>
                <span className="text-muted-foreground">6 / 10</span>
              </div>
              <Slider defaultValue={[6]} max={10} step={1} />
            </div>
          </CardContent>
        </Card>
      </div>

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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Downgrade plan?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll lose access to some features at the end of the current
              billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingPlan(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPlan) setSelectedPlan(pendingPlan);
                toast("Plan updated");
              }}
            >
              Confirm downgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
