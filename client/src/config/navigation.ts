import {
  IconLayoutDashboard,
  IconReceipt2,
  IconTargetArrow,
  IconChartPie,
  IconSettings,
} from "@tabler/icons-react";
import { type Icon } from "@tabler/icons-react";

export type NavItem = {
  title: string;
  url: string;
  icon: Icon;
};

export const MainNavigation: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: IconReceipt2,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: IconTargetArrow,
  },
  {
    title: "Monthly Summary",
    url: "/summary",
    icon: IconChartPie,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
];
