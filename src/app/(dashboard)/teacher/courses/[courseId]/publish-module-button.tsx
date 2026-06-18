"use client";

import { toggleModulePublish } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

interface Props {
  moduleId: string;
  published: boolean;
}

export function PublishModuleButton({ moduleId, published }: Props) {
  const [pending, startTransition] = useTransition();

  const togglePublishHandler = async (id: string): Promise<void> => {
    await toggleModulePublish(id);
  };

  return (
    <Button
      variant={published ? "outline" : "primary"}
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => togglePublishHandler(moduleId))}
    >
      {pending ? "..." : published ? "Unpublish" : "Publish"}
    </Button>
  );
}
