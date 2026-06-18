"use client";

import { removeEnrollment } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function RemoveEnrollmentButton({
  enrollmentId,
}: {
  enrollmentId: string;
}) {
  const [pending, startTransition] = useTransition();

  const removeEnrollmentHandler = async (enrollmentId: string) => {
    await removeEnrollment(enrollmentId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (confirm("Remove this enrollment?")) {
          startTransition(() => removeEnrollmentHandler(enrollmentId));
        }
      }}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
