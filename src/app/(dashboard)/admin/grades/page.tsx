import { db } from "@/lib/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { GradeOverrideForm } from "./grade-override-form";

export default async function GradeOverridePage() {
  const submissions = await db.submission.findMany({
    include: {
      student: true,
      assignment: { include: { module: { include: { course: true } } } },
      gradedBy: true,
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <PageShell
      title="Grade Override"
      description="Review and override student grades"
    >
      {submissions.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No submissions yet"
          description="Student submissions will appear here once they upload their work."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                      Submitted {formatDate(sub.submittedAt)} &middot; File:{" "}
                      {sub.fileName}
                    </p>
                    {sub.gradedBy && (
                      <p className="text-xs text-muted-foreground">
                        Graded by {sub.gradedBy.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {sub.grade !== null ? (
                      <Badge variant={sub.grade >= 50 ? "success" : "destructive"}>
                        {sub.grade}/100
                      </Badge>
                    ) : (
                      <Badge variant="warning">Ungraded</Badge>
                    )}
                    <GradeOverrideForm
                      submissionId={sub.id}
                      currentGrade={sub.grade}
                      currentFeedback={sub.feedback}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
