import { describe, it, expect } from "vitest";
import {
  hasPermission,
  getRolePermissions,
  PROTECTED_ROUTES,
  ROLE_DASHBOARDS,
  Role,
} from "@/lib/rbac";

describe("hasPermission", () => {
  it("grants admin access to user management", () => {
    expect(hasPermission("ADMIN", "users:create")).toBe(true);
    expect(hasPermission("ADMIN", "users:read")).toBe(true);
    expect(hasPermission("ADMIN", "users:delete")).toBe(true);
  });

  it("denies teacher access to user management", () => {
    expect(hasPermission("TEACHER", "users:create")).toBe(false);
    expect(hasPermission("TEACHER", "users:delete")).toBe(false);
  });

  it("grants teacher access to course creation", () => {
    expect(hasPermission("TEACHER", "courses:create")).toBe(true);
    expect(hasPermission("TEACHER", "assignments:create")).toBe(true);
  });

  it("grants student access to view courses and submit", () => {
    expect(hasPermission("STUDENT", "courses:view")).toBe(true);
    expect(hasPermission("STUDENT", "submissions:create")).toBe(true);
  });

  it("denies student access to grading", () => {
    expect(hasPermission("STUDENT", "submissions:grade")).toBe(false);
  });

  it("grants parent access to child data", () => {
    expect(hasPermission("PARENT", "child:grades")).toBe(true);
    expect(hasPermission("PARENT", "child:attendance")).toBe(true);
    expect(hasPermission("PARENT", "child:reports")).toBe(true);
  });

  it("denies parent access to course creation", () => {
    expect(hasPermission("PARENT", "courses:create")).toBe(false);
  });
});

describe("getRolePermissions", () => {
  it("returns all admin permissions including user management", () => {
    const perms = getRolePermissions("ADMIN");
    expect(perms).toContain("users:create");
    expect(perms).toContain("users:read");
    expect(perms).toContain("courses:create");
    expect(perms).toContain("submissions:grade");
  });

  it("returns teacher permissions without user management", () => {
    const perms = getRolePermissions("TEACHER");
    expect(perms).toContain("courses:create");
    expect(perms).toContain("assignments:create");
    expect(perms).not.toContain("users:create");
  });

  it("returns student permissions", () => {
    const perms = getRolePermissions("STUDENT");
    expect(perms).toContain("submissions:create");
    expect(perms).toContain("grades:view-own");
    expect(perms).not.toContain("submissions:grade");
  });

  it("returns parent permissions", () => {
    const perms = getRolePermissions("PARENT");
    expect(perms).toContain("child:grades");
    expect(perms).not.toContain("courses:create");
  });
});

describe("ROLE_DASHBOARDS", () => {
  it("maps each role to its dashboard path", () => {
    expect(ROLE_DASHBOARDS.ADMIN).toBe("/admin");
    expect(ROLE_DASHBOARDS.TEACHER).toBe("/teacher");
    expect(ROLE_DASHBOARDS.STUDENT).toBe("/student");
    expect(ROLE_DASHBOARDS.PARENT).toBe("/parent");
  });
});

describe("PROTECTED_ROUTES", () => {
  it("protects admin routes for admin only", () => {
    expect(PROTECTED_ROUTES["/admin"]).toEqual([Role.ADMIN]);
  });

  it("protects teacher routes for teacher only", () => {
    expect(PROTECTED_ROUTES["/teacher"]).toEqual([Role.TEACHER]);
  });

  it("protects student routes for student only", () => {
    expect(PROTECTED_ROUTES["/student"]).toEqual([Role.STUDENT]);
  });

  it("protects parent routes for parent only", () => {
    expect(PROTECTED_ROUTES["/parent"]).toEqual([Role.PARENT]);
  });
});
