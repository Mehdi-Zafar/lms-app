"use client";

import { deleteUser } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [pending, startTransition] = useTransition();

  const deleteUserHandler = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (confirm(`Are you sure you want to delete ${userName}?`)) {
          startTransition(() => deleteUserHandler(userId));
        }
      }}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
