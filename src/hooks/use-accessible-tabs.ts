"use client";

import { useEffect, useState } from "react";
import { adminConfig } from "@/config/admin-config"; // ✅ Import adminConfig, not getAccessibleTabs
import type { Role } from "@/lib/rbac/permissions";

export function useAccessibleTabs() {
  const [tabs, setTabs] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const userStr = getCookie("user");
    if (userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setUserRole(user.role);

        // ✅ Filter from adminConfig.sidebar.tabs (which has icons!)
        const accessibleTabs = adminConfig.sidebar.tabs.filter((tab) =>
          tab.roles.includes(user.role),
        );

        setTabs(accessibleTabs);
      } catch (e) {
        console.error("Failed to parse user cookie");
        setTabs([]);
      }
    }
    setLoading(false);
  }, []);

  return { tabs, userRole, loading };
}
