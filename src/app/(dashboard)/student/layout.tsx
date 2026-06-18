import { requireRole } from "@/lib/auth-guard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("STUDENT");

  return (
    <DashboardLayout role="STUDENT" userName={session.user.name}>
      {children}
    </DashboardLayout>
  );
}
