import { db } from "@/lib/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: {
      teacher: true,
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell title="All Courses" description="View and manage all courses">
      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Courses will appear here once teachers create them."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Courses ({courses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Title</th>
                    <th className="pb-3 font-medium text-muted-foreground">Teacher</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Modules</th>
                    <th className="pb-3 font-medium text-muted-foreground">Students</th>
                    <th className="pb-3 font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 font-medium">{course.title}</td>
                      <td className="py-3 text-muted-foreground">
                        {course.teacher.name}
                      </td>
                      <td className="py-3">
                        <Badge variant={course.published ? "success" : "warning"}>
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {course._count.modules}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {course._count.enrollments}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatDate(course.createdAt)}
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
