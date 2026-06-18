import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Layers, Play, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function StudentCourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();

  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId: session!.user.id, courseId },
    },
  });

  if (!enrollment) notFound();

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: true,
      modules: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
          assignments: { orderBy: { dueDate: "asc" } },
        },
      },
    },
  });

  if (!course) notFound();

  return (
    <PageShell
      title={course.title}
      description={`Taught by ${course.teacher.name}`}
    >
      {course.modules.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No modules available"
          description="Course content will appear here once published by your teacher."
        />
      ) : (
        <div className="space-y-6">
          {course.modules.map((mod) => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle>
                  Module {mod.order}: {mod.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mod.lessons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Lessons</h4>
                    <ul className="space-y-2">
                      {mod.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.videoUrl ? (
                              <Play className="h-4 w-4 text-primary" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium text-sm">
                              {lesson.order}. {lesson.title}
                            </span>
                            {lesson.videoUrl && (
                              <Badge variant="default">Video</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 ml-6">
                            {lesson.content}
                          </p>
                          {lesson.videoUrl && (
                            <div className="mt-2 ml-6">
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Watch Video
                              </a>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mod.assignments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Assignments</h4>
                    <ul className="space-y-2">
                      {mod.assignments.map((assignment) => (
                        <li
                          key={assignment.id}
                          className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{assignment.title}</span>
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(assignment.dueDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
