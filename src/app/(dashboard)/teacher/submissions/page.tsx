import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { GradeForm } from "./grade-form";

export default async function TeacherSubmissionsPage() {
  const session = await auth();

  const submissions = await db.submission.findMany({
    where: {
      assignment: { module: { course: { teacherId: session!.user.id } } },
    },
    include: {
      student: true,
      assignment: { include: { module: { include: { course: true } } } },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <PageShell
      title="Student Submissions"
      description="Review and grade student work"
    >
      {submissions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No submissions yet"
          description="Student submissions will appear here."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Submissions ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{sub.student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {sub.assignment.module.course.title} &mdash;{" "}
                    {sub.assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(sub.submittedAt)} &middot;{" "}
                    {sub.fileName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {sub.grade !== null ? (
                    <Badge variant={sub.grade >= 50 ? "success" : "destructive"}>
                      {sub.grade}/100
                    </Badge>
                  ) : (
                    <Badge variant="warning">Ungraded</Badge>
                  )}
                  <GradeForm
                    submissionId={sub.id}
                    currentGrade={sub.grade}
                    currentFeedback={sub.feedback}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
