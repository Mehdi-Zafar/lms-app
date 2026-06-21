import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDb } from "../../mocks/db";
import { revalidatePath } from "next/cache";

const mockSession = vi.hoisted(() => ({ user: { id: "student-1", name: "Student", role: "STUDENT" } }));
vi.mock("@/lib/auth-guard", () => ({
  requireRole: vi.fn().mockResolvedValue(mockSession),
}));

vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

import { submitHomework } from "@/actions/student";

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitHomework", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error for invalid assignment ID", async () => {
    const fd = makeFormData({ assignmentId: "" });
    const result = await submitHomework(fd);
    expect(result).toEqual({ error: "Invalid assignment." });
  });

  it("returns error when no file is provided", async () => {
    const fd = makeFormData({ assignmentId: "assign-1" });
    const result = await submitHomework(fd);
    expect(result).toEqual({ error: "Please select a file." });
  });

  it("returns error when file exceeds 10MB", async () => {
    const fd = makeFormData({ assignmentId: "assign-1" });
    const bigFile = new File([new ArrayBuffer(11 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    fd.set("file", bigFile);

    const result = await submitHomework(fd);
    expect(result).toEqual({ error: "File size must be under 10MB." });
  });

  it("creates submission with file on success", async () => {
    const fd = makeFormData({ assignmentId: "assign-1" });
    const file = new File(["content"], "homework.pdf", { type: "application/pdf" });
    fd.set("file", file);
    mockDb.submission.create.mockResolvedValue({});

    const result = await submitHomework(fd);

    expect(result).toEqual({ success: true });
    expect(mockDb.submission.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        studentId: "student-1",
        assignmentId: "assign-1",
        fileName: "homework.pdf",
      }),
    });
    expect(revalidatePath).toHaveBeenCalledWith("/student/assignments");
    expect(revalidatePath).toHaveBeenCalledWith("/student/upload");
  });
});
