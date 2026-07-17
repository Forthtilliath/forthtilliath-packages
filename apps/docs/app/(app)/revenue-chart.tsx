"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@forthtilliath/shadcn-ui/components/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "@forthtilliath/shadcn-ui/lib/recharts";

const data = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 3800, expenses: 2600 },
  { month: "Mar", revenue: 5100, expenses: 3100 },
  { month: "Apr", revenue: 4700, expenses: 2900 },
  { month: "May", revenue: 6200, expenses: 3400 },
  { month: "Jun", revenue: 7300, expenses: 3800 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          Revenue vs. expenses for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
