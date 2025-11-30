"use client";

import React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { adminConfig } from "@/config/admin-config";
import { useAccessibleTabs } from "@/hooks/use-accessible-tabs";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { tabs, loading } = useAccessibleTabs();

  return (
    <>
      <Header config={adminConfig.header} />
      <Sidebar tabs={tabs} loading={loading} />
      <main className={cn("lg:pl-64", "transition-all duration-300")}>
        {children}
      </main>
    </>
  );
}
