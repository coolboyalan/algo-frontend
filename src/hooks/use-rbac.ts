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
    // Get user from cookies (via document.cookie for client-side)
    // OR fetch from a client-accessible endpoint
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    // Since userRole is httpOnly, we need to get it from the user cookie
    const userStr = getCookie("user");
    if (userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setUserRole(user.role);
      } catch (e) {
        console.error("Failed to parse user cookie");
      }
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
