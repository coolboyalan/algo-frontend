import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TAB_PERMISSIONS } from "@/config/tabs-config"; // ✅ Server-safe import
import type { Role } from "@/lib/rbac/permissions";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("userRole")?.value as Role | undefined;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/signup", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔥 Role-based route protection
  if (userRole) {
    const routeSegments = pathname.split("/").filter(Boolean);
    const route = routeSegments[0];

    const allowedRoles = TAB_PERMISSIONS[route];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
