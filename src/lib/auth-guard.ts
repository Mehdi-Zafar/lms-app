import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type RoleType, ROLE_DASHBOARDS } from "@/lib/rbac";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(roles: RoleType | RoleType[]) {
  const session = await requireAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(session.user.role as RoleType)) {
    const dashboard = ROLE_DASHBOARDS[session.user.role as RoleType] || "/login";
    redirect(dashboard);
  }

  return session;
}
