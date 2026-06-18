"use client";

import { useActionState } from "react";
import { enrollStudent } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnrollStudentFormProps {
  students: { id: string; name: string; email: string }[];
  courses: { id: string; title: string }[];
}

export function EnrollStudentForm({ students, courses }: EnrollStudentFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await enrollStudent(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enroll Student in Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium" htmlFor="studentId">
              Student
            </label>
            <Select id="studentId" name="studentId" required>
              <option value="">Select student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium" htmlFor="courseId">
              Course
            </label>
            <Select id="courseId" name="courseId" required>
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Enrolling..." : "Enroll"}
          </Button>
          {state?.error && (
            <p className="w-full text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="w-full text-sm text-success">Student enrolled!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
