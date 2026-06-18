import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BookOpen } from "lucide-react";
import { CreateCourseForm } from "./create-course-form";
import { PublishCourseButton } from "./publish-course-button";
import Link from "next/link";

export default async function TeacherCoursesPage() {
  const session = await auth();
  const courses = await db.course.findMany({
    where: { teacherId: session!.user.id },
    include: {
      _count: { select: { modules: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell title="My Courses" description="Create and manage your courses">
      <CreateCourseForm />

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    <Link
                      href={`/teacher/courses/${course.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {course.title}
                    </Link>
                  </CardTitle>
                  <Badge variant={course.published ? "success" : "warning"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {course._count.modules} modules &middot;{" "}
                  {course._count.enrollments} students
                </div>
                <PublishCourseButton
                  courseId={course.id}
                  published={course.published}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
