import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDb } from "../../mocks/db";
import { revalidatePath } from "next/cache";

const mockSession = vi.hoisted(() => ({ user: { id: "teacher-1", name: "Teacher", role: "TEACHER" } }));
vi.mock("@/lib/auth-guard", () => ({
  requireRole: vi.fn().mockResolvedValue(mockSession),
}));

import {
  createCourse,
  toggleCoursePublish,
  createModule,
  gradeSubmission,
  logAttendance,
} from "@/actions/teacher";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

describe("createCourse", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid input", async () => {
    const result = await createCourse(makeFormData({ title: "A", description: "short" }));
    expect(result).toEqual({ error: "Please provide a title and description (min 10 chars)." });
  });

  it("creates course with teacher ID on valid input", async () => {
    mockDb.course.create.mockResolvedValue({});
    const result = await createCourse(makeFormData({
      title: "Math 101",
      description: "Introduction to mathematics fundamentals",
    }));

    expect(result).toEqual({ success: true });
    expect(mockDb.course.create).toHaveBeenCalledWith({
      data: {
        title: "Math 101",
        description: "Introduction to mathematics fundamentals",
        teacherId: "teacher-1",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/teacher/courses");
  });
});

describe("toggleCoursePublish", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error when course not found", async () => {
    mockDb.course.findFirst.mockResolvedValue(null);
    const result = await toggleCoursePublish("nonexistent");
    expect(result).toEqual({ error: "Course not found." });
  });

  it("toggles published state from false to true", async () => {
    mockDb.course.findFirst.mockResolvedValue({ id: "c1", published: false, teacherId: "teacher-1" });
    mockDb.course.update.mockResolvedValue({});

    const result = await toggleCoursePublish("c1");
    expect(result).toEqual({ success: true });
    expect(mockDb.course.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { published: true },
    });
  });

  it("toggles published state from true to false", async () => {
    mockDb.course.findFirst.mockResolvedValue({ id: "c1", published: true, teacherId: "teacher-1" });
    mockDb.course.update.mockResolvedValue({});

    const result = await toggleCoursePublish("c1");
    expect(mockDb.course.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { published: false },
    });
  });
});

describe("createModule", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid input", async () => {
    const result = await createModule(makeFormData({ title: "A", courseId: "" }));
    expect(result).toEqual({ error: "Invalid input." });
  });

  it("returns error when course not found", async () => {
    mockDb.course.findFirst.mockResolvedValue(null);
    const result = await createModule(makeFormData({ title: "Module 1", courseId: "c1" }));
    expect(result).toEqual({ error: "Course not found." });
  });

  it("creates module with correct order", async () => {
    mockDb.course.findFirst.mockResolvedValue({ id: "c1", _count: { modules: 3 } });
    mockDb.module.create.mockResolvedValue({});

    const result = await createModule(makeFormData({ title: "Module 4", courseId: "c1" }));
    expect(result).toEqual({ success: true });
    expect(mockDb.module.create).toHaveBeenCalledWith({
      data: { title: "Module 4", courseId: "c1", order: 4 },
    });
  });
});

describe("gradeSubmission", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid grade", async () => {
    const result = await gradeSubmission(makeFormData({ submissionId: "", grade: "abc" }));
    expect(result).toEqual({ error: "Invalid grade." });
  });

  it("updates submission with grade and feedback", async () => {
    mockDb.submission.update.mockResolvedValue({});
    const result = await gradeSubmission(makeFormData({
      submissionId: "sub-1",
      grade: "92",
      feedback: "Excellent",
    }));

    expect(result).toEqual({ success: true });
    expect(mockDb.submission.update).toHaveBeenCalledWith({
      where: { id: "sub-1" },
      data: { grade: 92, feedback: "Excellent", gradedById: "teacher-1" },
    });
  });
});

describe("logAttendance", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid input", async () => {
    const result = await logAttendance(makeFormData({
      studentId: "",
      courseId: "",
      date: "",
      status: "INVALID",
    }));
    expect(result).toEqual({ error: "Invalid input." });
  });

  it("returns error when course not owned by teacher", async () => {
    mockDb.course.findFirst.mockResolvedValue(null);
    const result = await logAttendance(makeFormData({
      studentId: "s1",
      courseId: "c1",
      date: "2024-03-15",
      status: "PRESENT",
    }));
    expect(result).toEqual({ error: "Course not found." });
  });

  it("upserts attendance log on success", async () => {
    mockDb.course.findFirst.mockResolvedValue({ id: "c1" });
    mockDb.attendanceLog.upsert.mockResolvedValue({});

    const result = await logAttendance(makeFormData({
      studentId: "s1",
      courseId: "c1",
      date: "2024-03-15",
      status: "PRESENT",
    }));

    expect(result).toEqual({ success: true });
    expect(mockDb.attendanceLog.upsert).toHaveBeenCalled();
  });
});
