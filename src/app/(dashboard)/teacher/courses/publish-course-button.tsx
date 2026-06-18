"use client";

import { toggleCoursePublish } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

interface PublishCourseButtonProps {
  courseId: string;
  published: boolean;
}

export function PublishCourseButton({ courseId, published }: PublishCourseButtonProps) {
  const [pending, startTransition] = useTransition();

  const togglePublishHandler = async (id: string): Promise<void> => {
    await toggleCoursePublish(id);
  };

  return (
    <Button
      variant={published ? "outline" : "primary"}
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => togglePublishHandler(courseId))}
    >
      {pending ? "..." : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
