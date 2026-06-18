import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookOpen, Users, FileText, ClipboardList } from "lucide-react";

export default async function TeacherDashboard() {
  const session = await auth();
  const teacherId = session!.user.id;

  const [courseCount, studentCount, submissionCount, ungradedCount] =
    await Promise.all([
      db.course.count({ where: { teacherId } }),
      db.enrollment.count({
        where: { course: { teacherId } },
      }),
      db.submission.count({
        where: { assignment: { module: { course: { teacherId } } } },
      }),
      db.submission.count({
        where: {
          assignment: { module: { course: { teacherId } } },
          grade: null,
        },
      }),
    ]);

  return (
    <PageShell
      title="Teacher Dashboard"
      description="Manage your courses and students"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Courses" value={courseCount} icon={BookOpen} />
        <StatCard title="Total Students" value={studentCount} icon={Users} />
        <StatCard title="Submissions" value={submissionCount} icon={FileText} />
        <StatCard
          title="Needs Grading"
          value={ungradedCount}
          icon={ClipboardList}
          description="Ungraded submissions"
        />
      </div>
    </PageShell>
  );
}
