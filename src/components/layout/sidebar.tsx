"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingsStore } from "@/store/settings-store";
import { Settings, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface SidebarTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  roles?: string[];
}

interface SidebarProps {
  tabs: SidebarTab[];
  loading?: boolean;
}

export function Sidebar({ tabs, loading = false }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSettingsStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-sidebar-bg border-r transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold text-heading">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)] lg:h-[calc(100%-4rem)]">
          <div className="flex flex-col gap-2 p-4">
            {/* Loading State */}
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted animate-pulse rounded-md"
                  />
                ))}
              </>
            ) : (
              /* Regular Tabs */
              tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    onClick={() => setSidebarOpen(false)} // ✅ Close sidebar on click
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 text-left font-normal",
                        isActive
                          ? "bg-tab-selected text-primary-foreground hover:bg-tab-selected/90"
                          : "text-subheading hover:bg-tab-hover hover:text-heading",
                      )}
                    >
                      {tab.icon}
                      <span className="flex-1">{tab.label}</span>
                      {tab.badge && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Settings Tab - Always at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-sidebar-bg">
          <Link
            href="/settings"
            onClick={() => setSidebarOpen(false)} // ✅ Close sidebar on settings click too
          >
            <Button
              variant={pathname === "/settings" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                pathname === "/settings"
                  ? "bg-tab-selected text-primary-foreground"
                  : "text-subheading hover:bg-tab-hover hover:text-heading",
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
