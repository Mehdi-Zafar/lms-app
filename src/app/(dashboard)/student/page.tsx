import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookOpen, ClipboardList, GraduationCap, Upload } from "lucide-react";

export default async function StudentDashboard() {
  const session = await auth();
  const studentId = session!.user.id;

  const [enrollmentCount, assignmentCount, submissionCount, gradedCount] =
    await Promise.all([
      db.enrollment.count({ where: { studentId } }),
      db.assignment.count({
        where: { module: { course: { enrollments: { some: { studentId } } } } },
      }),
      db.submission.count({ where: { studentId } }),
      db.submission.count({
        where: { studentId, grade: { not: null } },
      }),
    ]);

  return (
    <PageShell
      title="Student Dashboard"
      description="Your learning overview"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Enrolled Courses" value={enrollmentCount} icon={BookOpen} />
        <StatCard title="Assignments" value={assignmentCount} icon={ClipboardList} />
        <StatCard title="Submissions" value={submissionCount} icon={Upload} />
        <StatCard
          title="Graded"
          value={gradedCount}
          icon={GraduationCap}
          description="Submissions graded"
        />
      </div>
    </PageShell>
  );
}
