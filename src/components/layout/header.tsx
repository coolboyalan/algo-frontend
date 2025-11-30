"use client";

import React, { useEffect, useState } from "react";
import { Menu, Search, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/settings-store";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { logoutAction } from "@/lib/actions/auth";

export interface HeaderConfig {
  logo?: {
    type: "image" | "text";
    src?: string;
    text?: string;
    alt?: string;
  };
  menuItems?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  showSearch?: boolean;
  showNotifications?: boolean;
}

interface HeaderProps {
  config: HeaderConfig;
}

export function Header({ config }: HeaderProps) {
  const { toggleSidebar } = useSettingsStore();
  const {
    logo = { type: "text", text: "Admin Panel" },
    menuItems = [],
    showSearch = true,
    showNotifications = true,
  } = config;

  const [user, setUser] = useState<HeaderConfig["user"] | null>(null);

  useEffect(() => {
    // Read user info from cookie
    const userCookie = Cookies.get("user");

    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
          avatar: parsedUser.avatar,
        });
      } catch (e) {
        console.error("Failed to parse user cookie", e);
      }
    }
  }, []);

  async function handleLogout() {
    // Call server action to logout, then clear client cookies and redirect
    await logoutAction();
    Cookies.remove("user");
    Cookies.remove("token");
    Cookies.remove("userRole");
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header-bg backdrop-blur supports-[backdrop-filter]:bg-header-bg/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          {logo.type === "image" && logo.src ? (
            <Image
              src={logo.src}
              alt={logo.alt || "Logo"}
              width={64}
              height={64}
              className="h-8 w-8"
            />
          ) : (
            <span className="text-xl font-bold text-heading">{logo.text}</span>
          )}
        </div>

        {/* Desktop Menu Items */}
        <nav className="hidden lg:flex items-center gap-1 ml-8">
          {menuItems.map((item, index) => (
            <Button key={index} variant="ghost" asChild>
              <a href={item.href} className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </a>
            </Button>
          ))}
        </nav>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-background"
              />
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {showNotifications && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          )}

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start text-sm">
                  <span className="font-medium text-heading">
                    {user?.name || "Guest"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onSelect={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
