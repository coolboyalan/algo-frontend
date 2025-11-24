// components/auth/protected-route.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccessTab } from "@/lib/rbac/permissions";
import type { Role } from "@/lib/rbac/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTab?: string;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredTab,
  fallbackUrl = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        router.push(fallbackUrl);
        return;
      }

      const user = JSON.parse(userStr);
      const userRole: Role = user.role;

      // Check if user has access to the required tab
      if (requiredTab && !canAccessTab(userRole, requiredTab)) {
        router.push("/unauthorized");
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router, requiredTab, fallbackUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
