// lib/rbac/permissions.ts
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
import { TAB_PERMISSIONS } from "@/config/tabs-config";
export { TAB_PERMISSIONS };

// Action-based permissions for fine-grained control
export const ACTION_PERMISSIONS: Record<string, Role[]> = {
  // User actions
  "user.view": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "user.create": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "user.update": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "user.delete": [ROLES.SUPER_ADMIN],
  "user.suspend": [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Asset actions
  "asset.view": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "asset.process": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "asset.refund": [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Settings actions
  "settings.view": [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  "settings.update": [ROLES.SUPER_ADMIN],
};

// Check if user has permission for a tab
export function canAccessTab(userRole: Role, tabId: string): boolean {
  const allowedRoles = TAB_PERMISSIONS[tabId];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// Check if user can perform an action
export function canPerformAction(userRole: Role, action: string): boolean {
  const allowedRoles =
    ACTION_PERMISSIONS[action as keyof typeof ACTION_PERMISSIONS];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// Get accessible tabs for a user
export function getAccessibleTabs(userRole: Role, allTabs: any[]) {
  return allTabs.filter((tab) => canAccessTab(userRole, tab.id));
}

// Server-side role verification helper
export async function verifyRoleAccess(
  requiredRoles: Role[],
  cookieStore: any,
): Promise<boolean> {
  const userRole = cookieStore.get("userRole")?.value as Role | undefined;
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}
