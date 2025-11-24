// hooks/use-rbac.ts
"use client";
import { useEffect, useState } from "react";
import {
  canAccessTab,
  canPerformAction,
  getAccessibleTabs,
} from "@/lib/rbac/permissions";
import type { Role } from "@/lib/rbac/permissions";

export function useRBAC() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
    setLoading(false);
  }, []);

  return {
    userRole,
    loading,
    canAccessTab: (tabId: string) => {
      if (!userRole) return false;
      return canAccessTab(userRole, tabId);
    },
    canPerformAction: (action: string) => {
      if (!userRole) return false;
      return canPerformAction(userRole, action);
    },
    getAccessibleTabs: (allTabs: any[]) => {
      if (!userRole) return [];
      return getAccessibleTabs(userRole, allTabs);
    },
  };
}
