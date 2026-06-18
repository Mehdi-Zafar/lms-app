"use client";

import { useActionState } from "react";
import { submitHomework } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UploadForm({ assignmentId }: { assignmentId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await submitHomework(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <Input
        name="file"
        type="file"
        required
        accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.png"
      />
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success">Submitted successfully!</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Uploading..." : "Submit"}
      </Button>
    </form>
  );
}
