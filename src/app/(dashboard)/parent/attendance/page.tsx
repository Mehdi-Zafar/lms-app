import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { UserCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ParentAttendancePage() {
  const session = await auth();

  const children = await db.parentChild.findMany({
    where: { parentId: session!.user.id },
    include: {
      child: {
        include: {
          attendanceLogs: {
            include: { course: true },
            orderBy: { date: "desc" },
          },
        },
      },
    },
  });

  const allEmpty = children.every((c) => c.child.attendanceLogs.length === 0);

  const statusVariant = (status: string) => {
    switch (status) {
      case "PRESENT": return "success" as const;
      case "ABSENT": return "destructive" as const;
      case "LATE": return "warning" as const;
      default: return "outline" as const;
    }
  };

  return (
    <PageShell
      title="Attendance Logs"
      description="View your child's attendance records (read-only)"
    >
      {allEmpty ? (
        <EmptyState
          icon={UserCheck}
          title="No attendance records"
          description="Attendance records will appear here once logged by teachers."
        />
      ) : (
        <div className="space-y-6">
          {children.map(({ child }) => {
            if (child.attendanceLogs.length === 0) return null;

            const presentCount = child.attendanceLogs.filter(
              (l) => l.status === "PRESENT"
            ).length;
            const total = child.attendanceLogs.length;
            const rate = Math.round((presentCount / total) * 100);

            return (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{child.name}</CardTitle>
                    <Badge variant={rate >= 75 ? "success" : "warning"}>
                      Attendance: {rate}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 font-medium text-muted-foreground">
                            Date
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Course
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {child.attendanceLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-3 font-medium">
                              {formatDate(log.date)}
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {log.course.title}
                            </td>
                            <td className="py-3">
                              <Badge variant={statusVariant(log.status)}>
                                {log.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
