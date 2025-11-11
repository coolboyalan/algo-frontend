'use client';

import {
  Plane,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  BarChart3,
  Ticket,
  Building2,
  Tag,
  MessageSquare,
  Shield,
  Globe,
} from 'lucide-react';

export const adminConfig = {
  header: {
    logo: {
      type: 'text' as const,
      text: 'Flyomint',
    },
    menuItems: [], // ✅ Removed redundant menu items
    user: {
      name: 'Admin User',
      email: 'admin@flyomint.com',
    },
    showSearch: true,
    showNotifications: true,
  },

  sidebar: {
    tabs: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <BarChart3 className="h-5 w-5" />,
        href: '/dashboard',
      },
      {
        id: 'bookings',
        label: 'Bookings',
        icon: <Ticket className="h-5 w-5" />,
        href: '/bookings',
        badge: '24',
      },
      {
        id: 'flights',
        label: 'Flight Management',
        icon: <Plane className="h-5 w-5" />,
        href: '/flights',
      },
      {
        id: 'schedules',
        label: 'Flight Schedules',
        icon: <Calendar className="h-5 w-5" />,
        href: '/schedules',
      },
      {
        id: 'airlines',
        label: 'Airlines',
        icon: <Building2 className="h-5 w-5" />,
        href: '/airlines',
      },
      {
        id: 'airports',
        label: 'Airports & Routes',
        icon: <MapPin className="h-5 w-5" />,
        href: '/airports',
      },
      {
        id: 'passengers',
        label: 'Passengers',
        icon: <Users className="h-5 w-5" />,
        href: '/passengers',
        badge: '1.2k',
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: <CreditCard className="h-5 w-5" />,
        href: '/payments',
      },
      {
        id: 'promotions',
        label: 'Promotions & Deals',
        icon: <Tag className="h-5 w-5" />,
        href: '/promotions',
      },
      {
        id: 'feedback',
        label: 'Customer Feedback',
        icon: <MessageSquare className="h-5 w-5" />,
        href: '/feedback',
        badge: '12',
      },
      {
        id: 'reports',
        label: 'Reports & Analytics',
        icon: <BarChart3 className="h-5 w-5" />,
        href: '/reports',
      },
      {
        id: 'apis',
        label: 'API Integration',
        icon: <Globe className="h-5 w-5" />,
        href: '/apis',
      },
      {
        id: 'security',
        label: 'Security & Roles',
        icon: <Shield className="h-5 w-5" />,
        href: '/security',
      },
    ],
  },
};
