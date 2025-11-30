"use server";
import { cookies } from "next/headers";
import { canPerformAction, type Role } from "@/lib/rbac/permissions";

export type AccessResult =
  | { success: true; userRole: Role }
  | { success: false; error: string };

export async function verifyAccess(
  requiredAction: string,
): Promise<AccessResult> {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value as Role | undefined;

  if (!userRole) {
    return {
      success: false,
      error: "You must be logged in to perform this action",
    };
  }

  if (!canPerformAction(userRole, requiredAction)) {
    const actionParts = requiredAction.split(".");
    const action = actionParts[1] || "access";
    const resource = actionParts[0] || "this resource";

    return {
      success: false,
      error: `You don't have permission to ${action} ${resource}`,
    };
  }

  return { success: true, userRole };
}

export async function getUserRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  return (cookieStore.get("userRole")?.value as Role | null) || null;
}
