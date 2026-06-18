"use client";

import { useState } from "react";
import { useActionState } from "react";
import { logAttendance } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  enrollments: { student: { id: string; name: string } }[];
}

export function LogAttendanceForm({ courses }: { courses: Course[] }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await logAttendance(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label className="text-sm font-medium">Course</label>
            <Select
              name="courseId"
              required
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-[180px]">
            <label className="text-sm font-medium">Student</label>
            <Select name="studentId" required>
              <option value="">Select student...</option>
              {selectedCourse?.enrollments.map((e) => (
                <option key={e.student.id} value={e.student.id}>
                  {e.student.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input name="date" type="date" required />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select name="status" required>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="EXCUSED">Excused</option>
            </Select>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Log"}
          </Button>
          {state?.error && (
            <p className="w-full text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="w-full text-sm text-success">Attendance logged!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
