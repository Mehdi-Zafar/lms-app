import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users, BookOpen, GraduationCap, UserCheck } from "lucide-react";

export default async function ParentDashboard() {
  const session = await auth();

  const parentLinks = await db.parentChild.findMany({
    where: { parentId: session!.user.id },
    include: {
      child: {
        include: {
          enrollments: { include: { course: true } },
          _count: {
            select: { submissions: true, attendanceLogs: true },
          },
        },
      },
    },
  });

  const children = parentLinks.map((link) => link.child);

  return (
    <PageShell
      title="Parent Dashboard"
      description="View your children's academic progress"
    >
      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No linked students"
          description="Contact the administrator to link your account to your child's profile."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Children" value={children.length} icon={Users} />
            <StatCard
              title="Total Courses"
              value={children.reduce((sum, c) => sum + c.enrollments.length, 0)}
              icon={BookOpen}
            />
            <StatCard
              title="Submissions"
              value={children.reduce((sum, c) => sum + c._count.submissions, 0)}
              icon={GraduationCap}
            />
            <StatCard
              title="Attendance Logs"
              value={children.reduce(
                (sum, c) => sum + c._count.attendanceLogs,
                0
              )}
              icon={UserCheck}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {children.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <CardTitle>{child.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{child.email}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Enrolled courses:</span>{" "}
                      {child.enrollments.length}
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {child.enrollments.map((e) => (
                        <li key={e.id}>{e.course.title}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
