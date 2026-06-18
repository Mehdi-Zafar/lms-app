import Link from "next/link";
import { GraduationCap, Shield, BookOpen, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">EduLMS</span>
          </div>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            School Learning
            <br />
            <span className="text-primary">Management System</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A comprehensive educational platform with role-based access control.
            Manage courses, grades, attendance, and more — all in one place.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RoleCard
              icon={Shield}
              title="Admin"
              items={[
                "Create user accounts",
                "Assign classes",
                "Override grades",
              ]}
            />
            <RoleCard
              icon={BookOpen}
              title="Teacher"
              items={[
                "Create courses & modules",
                "Grade submissions",
                "Write progress reports",
              ]}
            />
            <RoleCard
              icon={Users}
              title="Student"
              items={[
                "View enrolled courses",
                "Watch video lectures",
                "Upload homework",
              ]}
            />
            <RoleCard
              icon={UserCheck}
              title="Parent"
              items={[
                "View child's grades",
                "Check attendance logs",
                "Read-only access",
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        EduLMS — Multi-Tier School Learning Management System
      </footer>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Shield;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
