import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentGradesPage() {
  const session = await auth();

  const submissions = await db.submission.findMany({
    where: { studentId: session!.user.id },
    include: {
      assignment: { include: { module: { include: { course: true } } } },
      gradedBy: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  const gradedSubmissions = submissions.filter((s) => s.grade !== null);
  const avgGrade =
    gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce((sum, s) => sum + s.grade!, 0) /
            gradedSubmissions.length
        )
      : null;

  return (
    <PageShell title="My Grades" description="View your grades and feedback">
      {avgGrade !== null && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">Overall Average</p>
          <p className="text-4xl font-bold text-primary mt-1">{avgGrade}%</p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {gradedSubmissions.length} graded submissions
          </p>
        </div>
      )}

      {submissions.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No grades yet"
          description="Submit assignments to receive grades."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submission Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Assignment</th>
                    <th className="pb-3 font-medium text-muted-foreground">Course</th>
                    <th className="pb-3 font-medium text-muted-foreground">Submitted</th>
                    <th className="pb-3 font-medium text-muted-foreground">Grade</th>
                    <th className="pb-3 font-medium text-muted-foreground">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">{sub.assignment.title}</td>
                      <td className="py-3 text-muted-foreground">
                        {sub.assignment.module.course.title}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatDate(sub.submittedAt)}
                      </td>
                      <td className="py-3">
                        {sub.grade !== null ? (
                          <Badge
                            variant={sub.grade >= 50 ? "success" : "destructive"}
                          >
                            {sub.grade}/100
                          </Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {sub.feedback || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
