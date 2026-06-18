import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CreateReportForm } from "./create-report-form";

export default async function TeacherReportsPage() {
  const session = await auth();

  const [students, reports] = await Promise.all([
    db.user.findMany({
      where: {
        role: "STUDENT",
        enrollments: { some: { course: { teacherId: session!.user.id } } },
      },
      orderBy: { name: "asc" },
    }),
    db.progressReport.findMany({
      where: { authorId: session!.user.id },
      include: { student: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <PageShell
      title="Progress Reports"
      description="Write and manage student progress reports"
    >
      <CreateReportForm students={students} />

      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-border p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{report.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Student: {report.student.name}
                </p>
                <p className="text-sm">{report.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
