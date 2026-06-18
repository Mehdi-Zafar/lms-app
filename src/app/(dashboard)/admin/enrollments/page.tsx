import { db } from "@/lib/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { EnrollStudentForm } from "./enroll-form";
import { RemoveEnrollmentButton } from "./remove-enrollment-button";

export default async function EnrollmentsPage() {
  const [students, courses, enrollments] = await Promise.all([
    db.user.findMany({ where: { role: "STUDENT" }, orderBy: { name: "asc" } }),
    db.course.findMany({ orderBy: { title: "asc" } }),
    db.enrollment.findMany({
      include: { student: true, course: { include: { teacher: true } } },
      orderBy: { enrolledAt: "desc" },
    }),
  ]);

  return (
    <PageShell
      title="Class Assignments"
      description="Enroll students in courses"
    >
      <EnrollStudentForm students={students} courses={courses} />

      <Card>
        <CardHeader>
          <CardTitle>Current Enrollments ({enrollments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Student</th>
                  <th className="pb-3 font-medium text-muted-foreground">Course</th>
                  <th className="pb-3 font-medium text-muted-foreground">Teacher</th>
                  <th className="pb-3 font-medium text-muted-foreground">Enrolled</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 font-medium">
                      {enrollment.student.name}
                    </td>
                    <td className="py-3">{enrollment.course.title}</td>
                    <td className="py-3 text-muted-foreground">
                      {enrollment.course.teacher.name}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(enrollment.enrolledAt)}
                    </td>
                    <td className="py-3">
                      <RemoveEnrollmentButton enrollmentId={enrollment.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
