import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ClipboardList } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentAssignmentsPage() {
  const session = await auth();
  const studentId = session!.user.id;

  const assignments = await db.assignment.findMany({
    where: {
      module: {
        published: true,
        course: { enrollments: { some: { studentId } } },
      },
    },
    include: {
      module: { include: { course: true } },
      submissions: { where: { studentId } },
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <PageShell title="Assignments" description="View your assignments and deadlines">
      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments"
          description="No assignments have been posted for your courses yet."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const submitted = assignment.submissions.length > 0;
                const isPastDue = new Date(assignment.dueDate) < new Date();

                return (
                  <div
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.module.course.title} &mdash;{" "}
                        {assignment.module.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                      {submitted ? (
                        <Badge variant="success">Submitted</Badge>
                      ) : isPastDue ? (
                        <Badge variant="destructive">Past Due</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
