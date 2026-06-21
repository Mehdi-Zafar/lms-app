import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDb } from "../../mocks/db";
import { revalidatePath } from "next/cache";

const mockSession = vi.hoisted(() => ({ user: { id: "admin-1", name: "Admin", role: "ADMIN" } }));
vi.mock("@/lib/auth-guard", () => ({
  requireRole: vi.fn().mockResolvedValue(mockSession),
}));

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed-password") },
}));

import {
  createUser,
  deleteUser,
  enrollStudent,
  removeEnrollment,
  overrideGrade,
} from "@/actions/admin";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

describe("createUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid input", async () => {
    const result = await createUser(makeFormData({ name: "", email: "bad", password: "12", role: "INVALID" }));
    expect(result).toEqual({ error: "Invalid input. Please check all fields." });
  });

  it("returns error for duplicate email", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "existing" });
    const result = await createUser(makeFormData({
      name: "Test User",
      email: "test@school.edu",
      password: "password123",
      role: "STUDENT",
    }));
    expect(result).toEqual({ error: "A user with this email already exists." });
  });

  it("creates user with hashed password on valid input", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({ id: "new-user" });

    const result = await createUser(makeFormData({
      name: "New User",
      email: "new@school.edu",
      password: "password123",
      role: "STUDENT",
    }));

    expect(result).toEqual({ success: true });
    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: {
        name: "New User",
        email: "new@school.edu",
        password: "hashed-password",
        role: "STUDENT",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
  });
});

describe("deleteUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes user and revalidates", async () => {
    mockDb.user.delete.mockResolvedValue({});
    const result = await deleteUser("user-123");

    expect(result).toEqual({ success: true });
    expect(mockDb.user.delete).toHaveBeenCalledWith({ where: { id: "user-123" } });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/users");
  });
});

describe("enrollStudent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for missing fields", async () => {
    const result = await enrollStudent(makeFormData({ studentId: "", courseId: "" }));
    expect(result).toEqual({ error: "Please select both a student and a course." });
  });

  it("returns error for duplicate enrollment", async () => {
    mockDb.enrollment.findUnique.mockResolvedValue({ id: "existing" });
    const result = await enrollStudent(makeFormData({ studentId: "s1", courseId: "c1" }));
    expect(result).toEqual({ error: "Student is already enrolled in this course." });
  });

  it("creates enrollment on success", async () => {
    mockDb.enrollment.findUnique.mockResolvedValue(null);
    mockDb.enrollment.create.mockResolvedValue({});

    const result = await enrollStudent(makeFormData({ studentId: "s1", courseId: "c1" }));
    expect(result).toEqual({ success: true });
    expect(mockDb.enrollment.create).toHaveBeenCalledWith({ data: { studentId: "s1", courseId: "c1" } });
  });
});

describe("removeEnrollment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("removes enrollment and revalidates", async () => {
    mockDb.enrollment.delete.mockResolvedValue({});
    const result = await removeEnrollment("enroll-1");

    expect(result).toEqual({ success: true });
    expect(mockDb.enrollment.delete).toHaveBeenCalledWith({ where: { id: "enroll-1" } });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/enrollments");
  });
});

describe("overrideGrade", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid grade", async () => {
    const result = await overrideGrade(makeFormData({ submissionId: "", grade: "150" }));
    expect(result).toEqual({ error: "Invalid grade. Must be between 0 and 100." });
  });

  it("updates submission grade on valid input", async () => {
    mockDb.submission.update.mockResolvedValue({});

    const result = await overrideGrade(makeFormData({
      submissionId: "sub-1",
      grade: "85",
      feedback: "Good work",
    }));

    expect(result).toEqual({ success: true });
    expect(mockDb.submission.update).toHaveBeenCalledWith({
      where: { id: "sub-1" },
      data: { grade: 85, feedback: "Good work", gradedById: "admin-1" },
    });
  });
});
