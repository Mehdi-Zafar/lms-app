"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Upload,
  UserCheck,
  BarChart3,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { type RoleType } from "@/lib/rbac";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: Record<RoleType, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Enrollments", href: "/admin/enrollments", icon: UserCheck },
    { label: "Grade Override", href: "/admin/grades", icon: ClipboardList },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
    { label: "Submissions", href: "/teacher/submissions", icon: FileText },
    { label: "Attendance", href: "/teacher/attendance", icon: UserCheck },
    { label: "Reports", href: "/teacher/reports", icon: BarChart3 },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/courses", icon: BookOpen },
    { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
    { label: "My Grades", href: "/student/grades", icon: GraduationCap },
    { label: "Upload Work", href: "/student/upload", icon: Upload },
  ],
  PARENT: [
    { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
    { label: "Grades", href: "/parent/grades", icon: GraduationCap },
    { label: "Attendance", href: "/parent/attendance", icon: UserCheck },
    { label: "Reports", href: "/parent/reports", icon: BarChart3 },
  ],
};

interface SidebarProps {
  role: RoleType;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] || [];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-sidebar-bg text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-accent px-6">
        <GraduationCap className="h-7 w-7 text-blue-400" />
        <span className="text-lg font-bold">EduLMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${role.toLowerCase()}` &&
                pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-white"
                      : "text-slate-300 hover:bg-sidebar-accent/60 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-accent px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="text-xs text-slate-400 capitalize">{role.toLowerCase()}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-sidebar-accent hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
