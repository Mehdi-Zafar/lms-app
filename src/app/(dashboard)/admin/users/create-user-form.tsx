"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await createUser(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              Full Name
            </label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@school.edu"
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
              minLength={6}
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="role">
              Role
            </label>
            <Select id="role" name="role" required>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-success">User created successfully!</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
