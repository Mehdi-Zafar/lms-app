"use client";

import { useActionState } from "react";
import { createModule } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function AddModuleForm({ courseId }: { courseId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await createModule(formData);
    },
    null
  );

  return (
    <Card>
      <CardContent className="p-4">
        <form action={formAction} className="flex items-end gap-4">
          <input type="hidden" name="courseId" value={courseId} />
          <div className="flex-1">
            <label className="text-sm font-medium">New Module</label>
            <Input name="title" required placeholder="Module title" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Adding..." : "Add Module"}
          </Button>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
