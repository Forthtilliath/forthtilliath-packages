import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@forthtilliath/shadcn-ui/components/table";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

const orders: Order[] = [
  { id: "ORD-3210", customer: "Olivia Martin", amount: 249.0, status: "paid" },
  {
    id: "ORD-3209",
    customer: "Jackson Lee",
    amount: 129.99,
    status: "pending",
  },
  { id: "ORD-3208", customer: "Isabella Nguyen", amount: 39.0, status: "paid" },
  { id: "ORD-3207", customer: "William Kim", amount: 599.0, status: "failed" },
  { id: "ORD-3206", customer: "Sofia Davis", amount: 79.5, status: "paid" },
];

const statusVariant: Record<
  Order["status"],
  "default" | "secondary" | "destructive"
> = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>
          The last 5 orders across all customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[order.status]}
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {currency.format(order.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
