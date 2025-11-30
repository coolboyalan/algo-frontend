// NO "use client" directive here!
import { ROLES, type Role } from "@/lib/rbac/permissions";

export interface TabConfig {
  id: string;
  label: string;
  href: string;
  description?: string;
  roles: Role[];
  badge?: string | number;
}

export const tabsConfig: TabConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    description: "KPIs, revenue, bookings overview",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "user-dashboard",
    label: "My Dashboard",
    href: "/user-dashboard",
    description: "Personal trading dashboard",
    roles: [ROLES.USER],
  },
  {
    id: "assets",
    label: "Assets",
    href: "/assets",
    description: "Manage assets",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "dailyAsset",
    label: "Daily Asset",
    href: "/daily-asset",
    description: "Daily asset tracking",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "optionBuffer",
    label: "Option Buffer",
    href: "/option-buffer",
    description: "Options buffer overview",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "option-trades",
    label: "Option Trades",
    href: "/option-trades",
    description: "Manage trade history",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  },
  {
    id: "brokerKeys",
    label: "Broker Keys",
    href: "/broker-keys",
    description: "Manage API keys",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  },
  {
    id: "brokers",
    label: "Brokers",
    href: "/brokers",
    description: "View and edit brokers",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "users",
    label: "Users",
    href: "/users",
    description: "User management",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    description: "Manage your account",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER],
  },
];

// Generate route-to-roles mapping for middleware
export const TAB_PERMISSIONS: Record<string, Role[]> = tabsConfig.reduce(
  (acc, tab) => {
    // Extract route name from href (e.g., "/assets" -> "assets")
    const routeName = tab.href.replace(/^\//, "").split("/")[0];
    acc[routeName] = tab.roles;
    return acc;
  },
  {} as Record<string, Role[]>,
);

// Helper function for filtering tabs by role
export function getAccessibleTabs(userRole: Role | null) {
  if (!userRole) return [];
  return tabsConfig.filter((tab) => tab.roles.includes(userRole));
}
