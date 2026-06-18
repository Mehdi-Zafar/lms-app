import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LogAttendanceForm } from "./log-attendance-form";

export default async function TeacherAttendancePage() {
  const session = await auth();

  const [courses, recentLogs] = await Promise.all([
    db.course.findMany({
      where: { teacherId: session!.user.id },
      include: {
        enrollments: { include: { student: true } },
      },
    }),
    db.attendanceLog.findMany({
      where: { course: { teacherId: session!.user.id } },
      include: { student: true, course: true },
      orderBy: { date: "desc" },
      take: 50,
    }),
  ]);

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
      title="Attendance"
      description="Log and manage student attendance"
    >
      <LogAttendanceForm courses={courses} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Student</th>
                  <th className="pb-3 font-medium text-muted-foreground">Course</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{log.student.name}</td>
                    <td className="py-3">{log.course.title}</td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(log.date)}
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
    </PageShell>
  );
}
