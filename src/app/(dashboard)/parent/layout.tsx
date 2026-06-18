import { requireRole } from "@/lib/auth-guard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("PARENT");

  return (
    <DashboardLayout role="PARENT" userName={session.user.name}>
      {children}
    </DashboardLayout>
  );
}
