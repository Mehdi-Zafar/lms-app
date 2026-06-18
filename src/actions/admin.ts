"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]),
});

export async function createUser(formData: FormData) {
  await requireRole("ADMIN");

  const parsed = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: "Invalid input. Please check all fields." };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await requireRole("ADMIN");

  await db.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { success: true };
}

const EnrollStudentSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
});

export async function enrollStudent(formData: FormData) {
  await requireRole("ADMIN");

  const parsed = EnrollStudentSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
  });

  if (!parsed.success) {
    return { error: "Please select both a student and a course." };
  }

  const { studentId, courseId } = parsed.data;

  const existing = await db.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });

  if (existing) {
    return { error: "Student is already enrolled in this course." };
  }

  await db.enrollment.create({ data: { studentId, courseId } });
  revalidatePath("/admin/enrollments");
  return { success: true };
}

export async function removeEnrollment(enrollmentId: string) {
  await requireRole("ADMIN");

  await db.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin/enrollments");
  return { success: true };
}

const OverrideGradeSchema = z.object({
  submissionId: z.string().min(1),
  grade: z.coerce.number().min(0).max(100),
  feedback: z.string().optional(),
});

export async function overrideGrade(formData: FormData) {
  const session = await requireRole("ADMIN");

  const parsed = OverrideGradeSchema.safeParse({
    submissionId: formData.get("submissionId"),
    grade: formData.get("grade"),
    feedback: formData.get("feedback"),
  });

  if (!parsed.success) {
    return { error: "Invalid grade. Must be between 0 and 100." };
  }

  const { submissionId, grade, feedback } = parsed.data;

  await db.submission.update({
    where: { id: submissionId },
    data: {
      grade,
      feedback: feedback || undefined,
      gradedById: session.user.id,
    },
  });

  revalidatePath("/admin/grades");
  return { success: true };
}

export async function linkParentChild(formData: FormData) {
  await requireRole("ADMIN");

  const parentId = formData.get("parentId") as string;
  const childId = formData.get("childId") as string;

  if (!parentId || !childId) {
    return { error: "Please select both a parent and a student." };
  }

  const existing = await db.parentChild.findUnique({
    where: { parentId_childId: { parentId, childId } },
  });

  if (existing) {
    return { error: "This parent-child link already exists." };
  }

  await db.parentChild.create({ data: { parentId, childId } });
  revalidatePath("/admin/users");
  return { success: true };
}
