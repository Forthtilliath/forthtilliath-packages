import { RecentOrders } from "./recent-orders";
import { RevenueChart } from "./revenue-chart";
import { StatCards } from "./stat-cards";

export default function DashboardPage() {
  return (
    <>
      <StatCards />
      <RevenueChart />
      <RecentOrders />
    </>
  );
}
