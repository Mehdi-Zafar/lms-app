"use client";

import { useActionState } from "react";
import { linkParentChild } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LinkParentFormProps {
  parents: User[];
  students: User[];
}

export function LinkParentForm({ parents, students }: LinkParentFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await linkParentChild(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Parent to Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="parentId">
              Parent
            </label>
            <Select id="parentId" name="parentId" required>
              <option value="">Select a parent...</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="childId">
              Student
            </label>
            <Select id="childId" name="childId" required>
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </Select>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-success">Link created successfully!</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Linking..." : "Link Parent & Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
