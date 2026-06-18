"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SubmitHomeworkSchema = z.object({
  assignmentId: z.string().min(1),
});

export async function submitHomework(formData: FormData) {
  const session = await requireRole("STUDENT");

  const parsed = SubmitHomeworkSchema.safeParse({
    assignmentId: formData.get("assignmentId"),
  });

  if (!parsed.success) return { error: "Invalid assignment." };

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "Please select a file." };

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return { error: "File size must be under 10MB." };

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name);
  const uniqueName = `${session.user.id}-${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  await db.submission.create({
    data: {
      studentId: session.user.id,
      assignmentId: parsed.data.assignmentId,
      fileUrl: `/uploads/${uniqueName}`,
      fileName: file.name,
    },
  });

  revalidatePath("/student/assignments");
  revalidatePath("/student/upload");
  return { success: true };
}
