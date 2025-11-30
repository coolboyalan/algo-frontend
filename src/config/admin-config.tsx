"use client";

import {
  BarChart3,
  Users,
  Folder,
  CalendarDays,
  Cpu,
  Columns,
  Key,
  StoreIcon,
  UserCog,
  LayoutDashboard,
} from "lucide-react";
import { tabsConfig } from "./tabs-config";

// Map icons to tabs - MUST MATCH tab.id from tabs-config.ts
const tabIcons: Record<string, React.ReactNode> = {
  dashboard: <BarChart3 className="h-5 w-5" />,
  "user-dashboard": <LayoutDashboard className="h-5 w-5" />,
  assets: <Folder className="h-5 w-5" />,
  dailyAsset: <CalendarDays className="h-5 w-5" />, // ✅ Match this
  optionBuffer: <Cpu className="h-5 w-5" />, // ✅ Match this
  "option-trades": <Columns className="h-5 w-5" />, // ✅ Match this
  brokerKeys: <Key className="h-5 w-5" />, // ✅ Match this
  brokers: <StoreIcon className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  profile: <UserCog className="h-5 w-5" />,
};

// Add icons to tabs for client-side use
export const adminConfig = {
  header: {
    logo: {
      type: "text" as const,
      text: "The Algoman",
    },
    menuItems: [],
    user: null,
    showSearch: false,
    showNotifications: true,
  },

  sidebar: {
    tabs: tabsConfig.map((tab) => {
      const icon = tabIcons[tab.id];
      console.log(`Tab ID: ${tab.id}, Has Icon: ${!!icon}`); // Debug line
      return {
        ...tab,
        icon: icon || null,
      };
    }),
  },
};

// Re-export for convenience
export { getAccessibleTabs } from "./tabs-config";
