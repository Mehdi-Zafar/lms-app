import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Upload } from "lucide-react";
import { UploadForm } from "./upload-form";

export default async function StudentUploadPage() {
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

  const pendingAssignments = assignments.filter(
    (a) => a.submissions.length === 0
  );

  return (
    <PageShell title="Upload Homework" description="Submit your assignments">
      {pendingAssignments.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="All caught up!"
          description="You've submitted all available assignments."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pendingAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle className="text-base">{assignment.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {assignment.module.course.title} &mdash;{" "}
                  {assignment.module.title}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {assignment.description}
                </p>
                <UploadForm assignmentId={assignment.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
