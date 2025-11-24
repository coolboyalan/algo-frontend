// lib/rbac.js
export const roleDefinitions = {
  admin: [
    { action: "*", resource: "*" }, // Full access
  ],
  user: [
    { action: "read", resource: "*" },
    { action: "create", resource: "posts" },
    { action: "update", resource: "posts", condition: "isOwner" },
    { action: "delete", resource: "posts", condition: "isOwner" },
  ],
  guest: [{ action: "read", resource: "posts" }],
};

export function canAccess({ userRole, action, resource, record }) {
  const rolePermissions = roleDefinitions[userRole] || [];

  return rolePermissions.some((permission) => {
    const actionMatch =
      permission.action === "*" || permission.action === action;
    const resourceMatch =
      permission.resource === "*" || permission.resource === resource;

    if (permission.condition === "isOwner" && record) {
      return actionMatch && resourceMatch && record.userId === user.id;
    }

    return actionMatch && resourceMatch;
  });
}
