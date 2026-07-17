import { Activity, CreditCard, DollarSign, Info, Users } from "lucide-react";

import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@forthtilliath/shadcn-ui/components/popover";

const stats = [
  {
    label: "Total Revenue",
    value: "$45,231.89",
    delta: "+20.1%",
    icon: DollarSign,
    info: "Gross revenue for the current billing period, before refunds.",
  },
  {
    label: "Subscriptions",
    value: "+2,350",
    delta: "+180.1%",
    icon: Users,
    info: "New paid subscriptions started this month.",
  },
  {
    label: "Sales",
    value: "+12,234",
    delta: "+19%",
    icon: CreditCard,
    info: "One-off purchases and add-ons, excluding subscriptions.",
  },
  {
    label: "Active Now",
    value: "+573",
    delta: "+201",
    icon: Activity,
    info: "Sessions active in the last 5 minutes.",
  },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <stat.icon className="size-3.5" />
              {stat.label}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stat.value}
            </CardTitle>
            <CardAction className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {stat.delta}
              </Badge>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground size-6"
                  >
                    <Info className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-muted-foreground w-56 text-sm">
                  {stat.info}
                </PopoverContent>
              </Popover>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
