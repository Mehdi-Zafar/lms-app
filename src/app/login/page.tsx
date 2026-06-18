"use client";

import { useActionState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROLE_DASHBOARDS, type RoleType } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
      console.log(result);

      if (result?.error) {
        return "Invalid email or password.";
      }

      const session = await getSession();
      const role = session?.user?.role as RoleType | undefined;
      const dashboard = role ? ROLE_DASHBOARDS[role] : "/";
      router.push(dashboard);
      router.refresh();
      return null;
    },
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to EduLMS</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@school.edu"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Demo Accounts
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">Admin:</span> admin@school.edu /
                password123
              </p>
              <p>
                <span className="font-medium">Teacher:</span> teacher@school.edu
                / password123
              </p>
              <p>
                <span className="font-medium">Student:</span> student@school.edu
                / password123
              </p>
              <p>
                <span className="font-medium">Parent:</span> parent@school.edu /
                password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
