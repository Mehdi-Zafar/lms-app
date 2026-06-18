"use client";

import { useState, useTransition } from "react";
import { createLesson } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function AddLessonForm({ moduleId }: { moduleId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="mt-2"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" /> Add Lesson
      </Button>
    );
  }

  return (
    <form
      className="mt-3 space-y-3 rounded-lg border border-border p-3"
      action={(formData) => {
        startTransition(async () => {
          const result = await createLesson(formData);
          if (result.error) setError(result.error);
          else setOpen(false);
        });
      }}
    >
      <input type="hidden" name="moduleId" value={moduleId} />
      <Input name="title" required placeholder="Lesson title" />
      <Textarea name="content" required placeholder="Lesson content" rows={2} />
      <Input name="videoUrl" placeholder="Video URL (optional)" />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Adding..." : "Add Lesson"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
