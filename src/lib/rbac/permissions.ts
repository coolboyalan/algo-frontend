
// lib/rbac/permissions.ts
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Map tabs to required permissions
export const TAB_PERMISSIONS: Record<string, Role[]> = {
  // Core Operations
  'dashboard': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  'bookings': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  
  // Flight Operations
  'flights': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'api-monitoring': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  
  // Financial
  'payments': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'refunds': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'invoices': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  
  // User Management
  'users': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'passengers': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  
  // Services & Add-ons
  'addons': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  
  // Communication
  'notifications': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'feedback': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  
  // Content & Marketing
  'cms': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'promotions': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  
  // Analytics & Reports
  'reports': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  
  // Security & Settings
  'roles': [ROLES.SUPER_ADMIN],
  'settings': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

// Action-based permissions for fine-grained control
export const ACTION_PERMISSIONS = {
  // Booking actions
  'booking.view': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  'booking.create': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.AGENT],
  'booking.update': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'booking.delete': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'booking.cancel': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  
  // User actions
  'user.view': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'user.create': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'user.update': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'user.delete': [ROLES.SUPER_ADMIN],
  'user.suspend': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  
  // Payment actions
  'payment.view': [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  'payment.process': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'payment.refund': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  
  // Settings actions
  'settings.view': [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  'settings.update': [ROLES.SUPER_ADMIN],
};

// Check if user has permission for a tab
export function canAccessTab(userRole: Role, tabId: string): boolean {
  const allowedRoles = TAB_PERMISSIONS[tabId];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// Check if user can perform an action
export function canPerformAction(userRole: Role, action: string): boolean {
  const allowedRoles = ACTION_PERMISSIONS[action as keyof typeof ACTION_PERMISSIONS];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// Get accessible tabs for a user
export function getAccessibleTabs(userRole: Role, allTabs: any[]) {
  return allTabs.filter(tab => canAccessTab(userRole, tab.id));
}
