// components/layout/conditional-layout.tsx (NEW CLIENT COMPONENT)
"use client";

import { usePathname } from "next/navigation";
import { LayoutWrapper } from "./layout-wrapper";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT have the LayoutWrapper
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  // If it's an auth page, render children directly without wrapper
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, wrap with LayoutWrapper (navbar, sidebar, etc.)
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
