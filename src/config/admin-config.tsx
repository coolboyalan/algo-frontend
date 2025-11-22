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

export const adminConfig = {
  header: {
    logo: {
      type: "text" as const,
      text: "Flyomint Admin",
    },
    menuItems: [],
    user: {
      name: "Admin User",
      email: "admin@flyomint.com",
    },
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
      },
      {
        id: "bookings",
        label: "Booking Management",
        icon: <Ticket className="h-5 w-5" />,
        href: "/bookings",
        badge: "24",
        description: "View, search, modify bookings",
      },

      // ==================== FLIGHT OPERATIONS ====================
      {
        id: "flights",
        label: "Flight Search API",
        icon: <Plane className="h-5 w-5" />,
        href: "/flights",
        description: "API integration, markup rules",
      },
      {
        id: "api-monitoring",
        label: "API Monitoring",
        icon: <Globe className="h-5 w-5" />,
        href: "/api-monitoring",
        description: "Logs, latency, retry management",
      },

      // ==================== FINANCIAL ====================
      {
        id: "payments",
        label: "Payment Management",
        icon: <CreditCard className="h-5 w-5" />,
        href: "/payments",
        description: "Transactions, gateway logs",
      },
      {
        id: "refunds",
        label: "Cancellation & Refunds",
        icon: <RefreshCw className="h-5 w-5" />,
        href: "/refunds",
        badge: "8",
        description: "Refund requests, approval workflow",
      },
      {
        id: "invoices",
        label: "Invoices & Tickets",
        icon: <FileText className="h-5 w-5" />,
        href: "/invoices",
        description: "Generate, customize, download PDFs",
      },

      // ==================== USER MANAGEMENT ====================
      {
        id: "users",
        label: "User Management",
        icon: <Users className="h-5 w-5" />,
        href: "/users",
        badge: "1.2k",
        description: "View users, reset password, suspend",
      },
      {
        id: "passengers",
        label: "Passenger Profiles",
        icon: <UserCog className="h-5 w-5" />,
        href: "/passengers",
        description: "Saved profiles, documents",
      },

      // ==================== SERVICES & ADD-ONS ====================
      {
        id: "addons",
        label: "Add-On Services",
        icon: <Package className="h-5 w-5" />,
        href: "/addons",
        description: "Insurance, meals, baggage, seats",
      },

      // ==================== COMMUNICATION ====================
      {
        id: "notifications",
        label: "Notifications & Email",
        icon: <Mail className="h-5 w-5" />,
        href: "/notifications",
        badge: "12",
        description: "Email templates, triggers, logs",
      },
      {
        id: "feedback",
        label: "Customer Feedback",
        icon: <MessageSquare className="h-5 w-5" />,
        href: "/feedback",
        description: "Reviews, complaints, support",
      },

      // ==================== CONTENT & MARKETING ====================
      {
        id: "cms",
        label: "CMS & Static Pages",
        icon: <FileEdit className="h-5 w-5" />,
        href: "/cms",
        description: "FAQs, T&C, policies, SEO",
      },
      {
        id: "promotions",
        label: "Promotions & Deals",
        icon: <Tag className="h-5 w-5" />,
        href: "/promotions",
        description: "Discount codes, offers",
      },

      // ==================== ANALYTICS & REPORTS ====================
      {
        id: "reports",
        label: "Reports & Analytics",
        icon: <TrendingUp className="h-5 w-5" />,
        href: "/reports",
        description: "Revenue, bookings, route analytics",
      },

      // ==================== SECURITY & SETTINGS ====================
      {
        id: "roles",
        label: "Roles & Permissions",
        icon: <Shield className="h-5 w-5" />,
        href: "/roles",
        description: "Admin access control, activity logs",
      },
      {
        id: "settings",
        label: "System Settings",
        icon: <Settings className="h-5 w-5" />,
        href: "/settings",
        description: "API config, payment gateway, general",
      },
    ],
  },
};
