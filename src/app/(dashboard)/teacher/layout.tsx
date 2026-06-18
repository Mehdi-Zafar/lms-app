import { requireRole } from "@/lib/auth-guard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("TEACHER");

  return (
    <DashboardLayout role="TEACHER" userName={session.user.name}>
      {children}
    </DashboardLayout>
  );
}
