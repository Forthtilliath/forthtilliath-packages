import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";

const stats = [
  {
    label: "Total Revenue",
    value: "$45,231.89",
    delta: "+20.1%",
    icon: DollarSign,
  },
  {
    label: "Subscriptions",
    value: "+2,350",
    delta: "+180.1%",
    icon: Users,
  },
  {
    label: "Sales",
    value: "+12,234",
    delta: "+19%",
    icon: CreditCard,
  },
  {
    label: "Active Now",
    value: "+573",
    delta: "+201",
    icon: Activity,
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
            <CardAction>
              <Badge variant="outline" className="text-xs">
                {stat.delta}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
