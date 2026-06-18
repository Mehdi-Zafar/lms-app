"use client";

import { useActionState } from "react";
import { createProgressReport } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  id: string;
  name: string;
}

export function CreateReportForm({ students }: { students: Student[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await createProgressReport(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Progress Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Student</label>
              <Select name="studentId" required>
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input name="title" required placeholder="Report title" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              name="content"
              required
              placeholder="Write the progress report..."
              rows={4}
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-success">Report created!</p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
