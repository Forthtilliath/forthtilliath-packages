"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

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
  RadioGroup,
  RadioGroupItem,
} from "@forthtilliath/shadcn-ui/components/radio-group";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@forthtilliath/shadcn-ui/components/toggle-group";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

import { InvoicesCard } from "./invoices-card";
import { UsageCard } from "./usage-card";

const plans = [
  { value: "free", label: "Free", price: "$0/mo" },
  { value: "pro", label: "Pro", price: "$29/mo" },
  { value: "enterprise", label: "Enterprise", price: "$99/mo" },
];

export default function BillingPage() {
  const [currentPlan] = useState("pro");
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [cycle, setCycle] = useState("monthly");

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

        <UsageCard />
      </div>

      <InvoicesCard />

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
