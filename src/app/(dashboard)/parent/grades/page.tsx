import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ParentGradesPage() {
  const session = await auth();

  const children = await db.parentChild.findMany({
    where: { parentId: session!.user.id },
    include: {
      child: {
        include: {
          submissions: {
            include: {
              assignment: {
                include: { module: { include: { course: true } } },
              },
            },
            orderBy: { submittedAt: "desc" },
          },
        },
      },
    },
  });

  const allEmpty = children.every((c) => c.child.submissions.length === 0);

  return (
    <PageShell
      title="Child's Grades"
      description="View your child's grades and feedback (read-only)"
    >
      {allEmpty ? (
        <EmptyState
          icon={GraduationCap}
          title="No grades yet"
          description="Your child's grades will appear here once available."
        />
      ) : (
        <div className="space-y-6">
          {children.map(({ child }) => {
            if (child.submissions.length === 0) return null;

            const graded = child.submissions.filter((s) => s.grade !== null);
            const avg =
              graded.length > 0
                ? Math.round(
                    graded.reduce((sum, s) => sum + s.grade!, 0) / graded.length
                  )
                : null;

            return (
              <Card key={child.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{child.name}</CardTitle>
                    {avg !== null && (
                      <Badge variant={avg >= 50 ? "success" : "destructive"}>
                        Average: {avg}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 font-medium text-muted-foreground">
                            Assignment
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Course
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Submitted
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Grade
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Feedback
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {child.submissions.map((sub) => (
                          <tr
                            key={sub.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-3 font-medium">
                              {sub.assignment.title}
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {sub.assignment.module.course.title}
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {formatDate(sub.submittedAt)}
                            </td>
                            <td className="py-3">
                              {sub.grade !== null ? (
                                <Badge
                                  variant={
                                    sub.grade >= 50 ? "success" : "destructive"
                                  }
                                >
                                  {sub.grade}/100
                                </Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </td>
                            <td className="py-3 text-sm text-muted-foreground max-w-xs truncate">
                              {sub.feedback || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
