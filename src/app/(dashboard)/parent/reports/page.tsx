import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ParentReportsPage() {
  const session = await auth();

  const children = await db.parentChild.findMany({
    where: { parentId: session!.user.id },
    include: {
      child: {
        include: {
          studentReports: {
            include: { author: true },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  const allEmpty = children.every(
    (c) => c.child.studentReports.length === 0
  );

  return (
    <PageShell
      title="Progress Reports"
      description="View your child's progress reports (read-only)"
    >
      {allEmpty ? (
        <EmptyState
          icon={BarChart3}
          title="No reports yet"
          description="Progress reports will appear here once written by teachers."
        />
      ) : (
        <div className="space-y-6">
          {children.map(({ child }) => {
            if (child.studentReports.length === 0) return null;

            return (
              <div key={child.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{child.name}</h3>
                {child.studentReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {report.title}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {report.author.name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {report.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
