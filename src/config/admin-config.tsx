// config/admin-config.tsx
"use client";

import {
  Plane,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  BarChart3,
  Ticket,
  FileText,
  Tag,
  MessageSquare,
  Shield,
  Globe,
  Settings,
  Mail,
  TrendingUp,
  Package,
  RefreshCw,
  FileEdit,
  UserCog,
} from "lucide-react";
import { ROLES } from "@/lib/rbac/permissions";

export const adminConfig = {
  header: {
    logo: {
      type: "text" as const,
      text: "Flyomint Admin",
    },
    menuItems: [],
    user: null,
    showSearch: true,
    showNotifications: true,
  },

  sidebar: {
    tabs: [
      // ==================== CORE OPERATIONS ====================
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <BarChart3 className="h-5 w-5" />,
        href: "/dashboard",
        description: "KPIs, revenue, bookings overview",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
      },
      {
        id: "bookings",
        label: "Booking Management",
        icon: <Ticket className="h-5 w-5" />,
        href: "/bookings",
        badge: "24",
        description: "View, search, modify bookings",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
      },

      // ==================== FLIGHT OPERATIONS ====================
      {
        id: "flights",
        label: "Flight Search API",
        icon: <Plane className="h-5 w-5" />,
        href: "/flights",
        description: "API integration, markup rules",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: "api-monitoring",
        label: "API Monitoring",
        icon: <Globe className="h-5 w-5" />,
        href: "/api-monitoring",
        description: "Logs, latency, retry management",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },

      // ==================== FINANCIAL ====================
      {
        id: "payments",
        label: "Payment Management",
        icon: <CreditCard className="h-5 w-5" />,
        href: "/payments",
        description: "Transactions, gateway logs",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: "refunds",
        label: "Cancellation & Refunds",
        icon: <RefreshCw className="h-5 w-5" />,
        href: "/refunds",
        badge: "8",
        description: "Refund requests, approval workflow",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: "invoices",
        label: "Invoices & Tickets",
        icon: <FileText className="h-5 w-5" />,
        href: "/invoices",
        description: "Generate, customize, download PDFs",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
      },

      // ==================== USER MANAGEMENT ====================
      {
        id: "users",
        label: "User Management",
        icon: <Users className="h-5 w-5" />,
        href: "/users",
        badge: "1.2k",
        description: "View users, reset password, suspend",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        id: "passengers",
        label: "Passenger Profiles",
        icon: <UserCog className="h-5 w-5" />,
        href: "/passengers",
        description: "Saved profiles, documents",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
      },

      // ==================== SERVICES & ADD-ONS ====================
      {
        id: "addons",
        label: "Add-On Services",
        icon: <Package className="h-5 w-5" />,
        href: "/addons",
        description: "Insurance, meals, baggage, seats",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      // ==================== COMMUNICATION ====================
      {
        id: "notifications",
        label: "Notifications & Email",
        icon: <Mail className="h-5 w-5" />,
        href: "/notifications",
        badge: "12",
        description: "Email templates, triggers, logs",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        id: "feedback",
        label: "Customer Feedback",
        icon: <MessageSquare className="h-5 w-5" />,
        href: "/feedback",
        description: "Reviews, complaints, support",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
      },

      // ==================== CONTENT & MARKETING ====================
      {
        id: "cms",
        label: "CMS & Static Pages",
        icon: <FileEdit className="h-5 w-5" />,
        href: "/cms",
        description: "FAQs, T&C, policies, SEO",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        id: "promotions",
        label: "Promotions & Deals",
        icon: <Tag className="h-5 w-5" />,
        href: "/promotions",
        description: "Discount codes, offers",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      // ==================== ANALYTICS & REPORTS ====================
      {
        id: "reports",
        label: "Reports & Analytics",
        icon: <TrendingUp className="h-5 w-5" />,
        href: "/reports",
        description: "Revenue, bookings, route analytics",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      // ==================== SECURITY & SETTINGS ====================
      {
        id: "roles",
        label: "Roles & Permissions",
        icon: <Shield className="h-5 w-5" />,
        href: "/roles",
        description: "Admin access control, activity logs",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        id: "settings",
        label: "System Settings",
        icon: <Settings className="h-5 w-5" />,
        href: "/settings",
        description: "API config, payment gateway, general",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
    ],
  },
};
