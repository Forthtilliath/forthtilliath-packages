"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@forthtilliath/shadcn-ui/components/carousel";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@forthtilliath/shadcn-ui/components/chart";
import { Progress } from "@forthtilliath/shadcn-ui/components/progress";
import { Skeleton } from "@forthtilliath/shadcn-ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@forthtilliath/shadcn-ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@forthtilliath/shadcn-ui/components/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "@forthtilliath/shadcn-ui/lib/recharts";

import { Demo, Section } from "../section";

const invoices = [
  {
    invoice: "INV001",
    status: "Paid",
    method: "Credit Card",
    amount: "$250.00",
  },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  {
    invoice: "INV003",
    status: "Unpaid",
    method: "Bank Transfer",
    amount: "$350.00",
  },
];

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
];

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function DataDisplaySection() {
  return (
    <Section
      id="data-display"
      title="Data Display"
      description="Table, Accordion, Tabs, Carousel, Chart, Progress, Skeleton."
    >
      <Demo label="Table" className="block">
        <Table>
          <TableCaption>A list of recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((row) => (
              <TableRow key={row.invoice}>
                <TableCell>{row.invoice}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.method}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>

      <Demo label="Accordion" className="block max-w-lg">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes, it comes with default styles from the theme.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>

      <Demo label="Tabs" className="block max-w-sm">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent
            value="account"
            className="text-muted-foreground text-sm"
          >
            Update your account settings.
          </TabsContent>
          <TabsContent
            value="password"
            className="text-muted-foreground text-sm"
          >
            Change your password.
          </TabsContent>
        </Tabs>
      </Demo>

      <Demo label="Carousel" className="block max-w-sm">
        <Carousel>
          <CarouselContent>
            {[1, 2, 3, 4].map((n) => (
              <CarouselItem key={n}>
                <div className="bg-muted flex h-32 items-center justify-center rounded-md text-2xl font-semibold">
                  {n}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Demo>

      <Demo label="Chart" className="block max-w-lg">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Demo>

      <Demo label="Progress" className="max-w-sm">
        <Progress value={66} />
      </Demo>

      <Demo label="Skeleton">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </Demo>
    </Section>
  );
}
