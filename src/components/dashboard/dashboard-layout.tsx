import { type RoleType } from "@/lib/rbac";
import { Sidebar } from "./sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  role: RoleType;
  userName: string;
  children: ReactNode;
}

export function DashboardLayout({ role, userName, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 ml-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
