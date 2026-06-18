import { requireRole } from "@/lib/auth-guard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("ADMIN");

  return (
    <DashboardLayout role="ADMIN" userName={session.user.name}>
      {children}
    </DashboardLayout>
  );
}
