import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Layers } from "lucide-react";
import { AddModuleForm } from "./add-module-form";
import { AddLessonForm } from "./add-lesson-form";
import { AddAssignmentForm } from "./add-assignment-form";
import { PublishModuleButton } from "./publish-module-button";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();

  const course = await db.course.findFirst({
    where: { id: courseId, teacherId: session!.user.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
          assignments: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!course) notFound();

  return (
    <PageShell
      title={course.title}
      description={course.description}
    >
      <AddModuleForm courseId={courseId} />

      {course.modules.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No modules yet"
          description="Add your first module to start building course content."
        />
      ) : (
        <div className="space-y-6">
          {course.modules.map((mod) => (
            <Card key={mod.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Module {mod.order}: {mod.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={mod.published ? "success" : "warning"}>
                      {mod.published ? "Published" : "Draft"}
                    </Badge>
                    <PublishModuleButton
                      moduleId={mod.id}
                      published={mod.published}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Lessons ({mod.lessons.length})
                  </h4>
                  {mod.lessons.length > 0 ? (
                    <ul className="space-y-1">
                      {mod.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex items-center gap-2 text-sm rounded-md bg-muted px-3 py-2"
                        >
                          <span className="font-medium">
                            {lesson.order}. {lesson.title}
                          </span>
                          {lesson.videoUrl && (
                            <Badge variant="outline">Video</Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No lessons yet.</p>
                  )}
                  <AddLessonForm moduleId={mod.id} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Assignments ({mod.assignments.length})
                  </h4>
                  {mod.assignments.length > 0 ? (
                    <ul className="space-y-1">
                      {mod.assignments.map((assignment) => (
                        <li
                          key={assignment.id}
                          className="flex items-center justify-between text-sm rounded-md bg-muted px-3 py-2"
                        >
                          <span className="font-medium">
                            {assignment.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(assignment.dueDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No assignments yet.
                    </p>
                  )}
                  <AddAssignmentForm moduleId={mod.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
