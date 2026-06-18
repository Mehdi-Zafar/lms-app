"use client";

import { useActionState } from "react";
import { createCourse } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await createCourse(formData);
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="text-sm font-medium" htmlFor="title">
              Title
            </label>
            <Input id="title" name="title" required placeholder="Course title" />
          </div>
          <div className="min-w-[300px] flex-[2]">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Course description (min 10 chars)"
              rows={1}
              className="min-h-[40px]"
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Course"}
          </Button>
          {state?.error && (
            <p className="w-full text-sm text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="w-full text-sm text-success">Course created!</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
