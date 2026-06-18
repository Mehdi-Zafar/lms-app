"use client";

import { useState, useTransition } from "react";
import { gradeSubmission } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3 } from "lucide-react";

interface GradeFormProps {
  submissionId: string;
  currentGrade: number | null;
  currentFeedback: string | null;
}

export function GradeForm({
  submissionId,
  currentGrade,
  currentFeedback,
}: GradeFormProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Edit3 className="h-4 w-4 mr-1" />
        {currentGrade !== null ? "Update" : "Grade"}
      </Button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await gradeSubmission(formData);
          setOpen(false);
        });
      }}
      className="flex items-end gap-2"
    >
      <input type="hidden" name="submissionId" value={submissionId} />
      <div>
        <label className="text-xs font-medium">Grade (0-100)</label>
        <Input
          name="grade"
          type="number"
          min={0}
          max={100}
          defaultValue={currentGrade ?? ""}
          className="w-20"
          required
        />
      </div>
      <div>
        <label className="text-xs font-medium">Feedback</label>
        <Textarea
          name="feedback"
          defaultValue={currentFeedback ?? ""}
          rows={1}
          className="w-48 min-h-[40px]"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "..." : "Save"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
