import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Team", url: "/team", icon: UsersRound },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Support", url: "/support", icon: LifeBuoy },
  { title: "Settings", url: "/settings", icon: Settings },
];
