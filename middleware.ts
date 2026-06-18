import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, ROLE_DASHBOARDS, type RoleType } from "@/lib/rbac";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  console.log("Middleware: user", user);
  if (pathname === "/login" || pathname === "/") {
    if (user?.role) {
      const dashboard = ROLE_DASHBOARDS[user.role as RoleType] || "/login";
      return NextResponse.redirect(new URL(dashboard, req.url));
    }
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!roles.includes(user.role as RoleType)) {
        const dashboard = ROLE_DASHBOARDS[user.role as RoleType] || "/login";
        return NextResponse.redirect(new URL(dashboard, req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|uploads).*)"],
};
