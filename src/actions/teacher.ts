"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateCourseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
});

export async function createCourse(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = CreateCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: "Please provide a title and description (min 10 chars)." };
  }

  await db.course.create({
    data: {
      ...parsed.data,
      teacherId: session.user.id,
    },
  });

  revalidatePath("/teacher/courses");
  return { success: true };
}

export async function toggleCoursePublish(courseId: string) {
  const session = await requireRole("TEACHER");

  const course = await db.course.findFirst({
    where: { id: courseId, teacherId: session.user.id },
  });

  if (!course) return { error: "Course not found." };

  await db.course.update({
    where: { id: courseId },
    data: { published: !course.published },
  });

  revalidatePath("/teacher/courses");
  return { success: true };
}

const CreateModuleSchema = z.object({
  title: z.string().min(2),
  courseId: z.string().min(1),
});

export async function createModule(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = CreateModuleSchema.safeParse({
    title: formData.get("title"),
    courseId: formData.get("courseId"),
  });

  if (!parsed.success) return { error: "Invalid input." };

  const course = await db.course.findFirst({
    where: { id: parsed.data.courseId, teacherId: session.user.id },
    include: { _count: { select: { modules: true } } },
  });

  if (!course) return { error: "Course not found." };

  await db.module.create({
    data: {
      title: parsed.data.title,
      courseId: parsed.data.courseId,
      order: course._count.modules + 1,
    },
  });

  revalidatePath(`/teacher/courses/${parsed.data.courseId}`);
  return { success: true };
}

export async function toggleModulePublish(moduleId: string) {
  const session = await requireRole("TEACHER");

  const mod = await db.module.findFirst({
    where: { id: moduleId, course: { teacherId: session.user.id } },
  });

  if (!mod) return { error: "Module not found." };

  await db.module.update({
    where: { id: moduleId },
    data: { published: !mod.published },
  });

  revalidatePath(`/teacher/courses/${mod.courseId}`);
  return { success: true };
}

const CreateLessonSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(5),
  videoUrl: z.string().url().optional().or(z.literal("")),
  moduleId: z.string().min(1),
});

export async function createLesson(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = CreateLessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    videoUrl: formData.get("videoUrl"),
    moduleId: formData.get("moduleId"),
  });

  if (!parsed.success) return { error: "Invalid input. Please fill all required fields." };

  const mod = await db.module.findFirst({
    where: { id: parsed.data.moduleId, course: { teacherId: session.user.id } },
    include: { _count: { select: { lessons: true } }, course: true },
  });

  if (!mod) return { error: "Module not found." };

  await db.lesson.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      videoUrl: parsed.data.videoUrl || null,
      moduleId: parsed.data.moduleId,
      order: mod._count.lessons + 1,
    },
  });

  revalidatePath(`/teacher/courses/${mod.course.id}`);
  return { success: true };
}

const CreateAssignmentSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  dueDate: z.string().min(1),
  moduleId: z.string().min(1),
});

export async function createAssignment(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = CreateAssignmentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    moduleId: formData.get("moduleId"),
  });

  if (!parsed.success) return { error: "Invalid input." };

  const mod = await db.module.findFirst({
    where: { id: parsed.data.moduleId, course: { teacherId: session.user.id } },
    include: { course: true },
  });

  if (!mod) return { error: "Module not found." };

  await db.assignment.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate),
      moduleId: parsed.data.moduleId,
    },
  });

  revalidatePath(`/teacher/courses/${mod.course.id}`);
  return { success: true };
}

const GradeSubmissionSchema = z.object({
  submissionId: z.string().min(1),
  grade: z.coerce.number().min(0).max(100),
  feedback: z.string().optional(),
});

export async function gradeSubmission(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = GradeSubmissionSchema.safeParse({
    submissionId: formData.get("submissionId"),
    grade: formData.get("grade"),
    feedback: formData.get("feedback"),
  });

  if (!parsed.success) return { error: "Invalid grade." };

  await db.submission.update({
    where: { id: parsed.data.submissionId },
    data: {
      grade: parsed.data.grade,
      feedback: parsed.data.feedback || null,
      gradedById: session.user.id,
    },
  });

  revalidatePath("/teacher/submissions");
  return { success: true };
}

const CreateReportSchema = z.object({
  studentId: z.string().min(1),
  title: z.string().min(2),
  content: z.string().min(10),
});

export async function createProgressReport(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = CreateReportSchema.safeParse({
    studentId: formData.get("studentId"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) return { error: "Invalid input." };

  await db.progressReport.create({
    data: {
      ...parsed.data,
      authorId: session.user.id,
    },
  });

  revalidatePath("/teacher/reports");
  return { success: true };
}

const LogAttendanceSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
});

export async function logAttendance(formData: FormData) {
  const session = await requireRole("TEACHER");

  const parsed = LogAttendanceSchema.safeParse({
    studentId: formData.get("studentId"),
    courseId: formData.get("courseId"),
    date: formData.get("date"),
    status: formData.get("status"),
  });

  if (!parsed.success) return { error: "Invalid input." };

  const course = await db.course.findFirst({
    where: { id: parsed.data.courseId, teacherId: session.user.id },
  });

  if (!course) return { error: "Course not found." };

  const dateObj = new Date(parsed.data.date);

  await db.attendanceLog.upsert({
    where: {
      studentId_courseId_date: {
        studentId: parsed.data.studentId,
        courseId: parsed.data.courseId,
        date: dateObj,
      },
    },
    create: {
      studentId: parsed.data.studentId,
      courseId: parsed.data.courseId,
      date: dateObj,
      status: parsed.data.status,
    },
    update: { status: parsed.data.status },
  });

  revalidatePath("/teacher/attendance");
  return { success: true };
}
