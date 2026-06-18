import { db } from "@/lib/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, BookOpen, GraduationCap, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [userCount, courseCount, studentCount, teacherCount, recentUsers] =
    await Promise.all([
      db.user.count(),
      db.course.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "TEACHER" } }),
      db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <PageShell title="Admin Dashboard" description="System overview and management">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={userCount} icon={Users} />
        <StatCard title="Courses" value={courseCount} icon={BookOpen} />
        <StatCard title="Students" value={studentCount} icon={GraduationCap} />
        <StatCard title="Teachers" value={teacherCount} icon={UserCheck} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "destructive"
                            : user.role === "TEACHER"
                            ? "default"
                            : user.role === "STUDENT"
                            ? "success"
                            : "warning"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
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
