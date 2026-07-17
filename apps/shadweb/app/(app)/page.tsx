import { RecentOrders } from "./recent-orders";
import { RevenueChart } from "./revenue-chart";
import { StatCards } from "./stat-cards";
import { WelcomeHeader } from "./welcome-header";

export default function DashboardPage() {
  return (
    <>
      <WelcomeHeader />
      <StatCards />
      <RevenueChart />
      <RecentOrders />
    </>
  );
}
