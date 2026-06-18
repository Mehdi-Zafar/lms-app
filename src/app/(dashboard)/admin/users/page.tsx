import { db } from "@/lib/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CreateUserForm } from "./create-user-form";
import { LinkParentForm } from "./link-parent-form";
import { DeleteUserButton } from "./delete-user-button";

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      children: { include: { child: true } },
      parents: { include: { parent: true } },
    },
  });

  const parents = users.filter((u) => u.role === "PARENT");
  const students = users.filter((u) => u.role === "STUDENT");

  return (
    <PageShell
      title="User Management"
      description="Create and manage user accounts"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CreateUserForm />
        <LinkParentForm parents={parents} students={students} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Linked</th>
                  <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
                    <td className="py-3 text-muted-foreground text-xs">
                      {user.role === "PARENT" &&
                        user.children.map((c) => c.child.name).join(", ")}
                      {user.role === "STUDENT" &&
                        user.parents.map((p) => p.parent.name).join(", ")}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3">
                      <DeleteUserButton userId={user.id} userName={user.name} />
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
