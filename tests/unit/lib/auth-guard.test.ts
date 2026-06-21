import { describe, it, expect, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

import { requireAuth, requireRole } from "@/lib/auth-guard";

describe("requireAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when no session", async () => {
    mockAuth.mockResolvedValue(null);
    await requireAuth();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("redirects when session has no user", async () => {
    mockAuth.mockResolvedValue({ user: undefined });
    await requireAuth();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns session when authenticated", async () => {
    const session = { user: { id: "1", name: "Test", role: "ADMIN" } };
    mockAuth.mockResolvedValue(session);
    const result = await requireAuth();
    expect(result).toEqual(session);
  });
});

describe("requireRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session when user has correct role", async () => {
    const session = { user: { id: "1", name: "Test", role: "ADMIN" } };
    mockAuth.mockResolvedValue(session);
    const result = await requireRole("ADMIN");
    expect(result).toEqual(session);
  });

  it("redirects when user has wrong role", async () => {
    const session = { user: { id: "1", name: "Test", role: "STUDENT" } };
    mockAuth.mockResolvedValue(session);
    await requireRole("ADMIN");
    expect(redirect).toHaveBeenCalledWith("/student");
  });

  it("accepts an array of roles", async () => {
    const session = { user: { id: "1", name: "Test", role: "TEACHER" } };
    mockAuth.mockResolvedValue(session);
    const result = await requireRole(["ADMIN", "TEACHER"]);
    expect(result).toEqual(session);
  });

  it("redirects when role not in allowed array", async () => {
    const session = { user: { id: "1", name: "Test", role: "PARENT" } };
    mockAuth.mockResolvedValue(session);
    await requireRole(["ADMIN", "TEACHER"]);
    expect(redirect).toHaveBeenCalledWith("/parent");
  });
});
