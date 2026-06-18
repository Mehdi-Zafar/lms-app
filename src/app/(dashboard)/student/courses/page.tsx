import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default async function StudentCoursesPage() {
  const session = await auth();

  const enrollments = await db.enrollment.findMany({
    where: { studentId: session!.user.id },
    include: {
      course: {
        include: {
          teacher: true,
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <PageShell title="My Courses" description="Courses you are enrolled in">
      {enrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="You haven't been enrolled in any courses. Contact your administrator."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map(({ course }) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {course.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {course.teacher.name}
                  </span>
                  <Badge variant="outline">
                    {course._count.modules} modules
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
