import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Role-based route protection", () => {
  test("admin cannot access teacher dashboard", async ({ page }) => {
    await loginAs(page, "admin");
    await page.goto("/teacher");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("admin cannot access student dashboard", async ({ page }) => {
    await loginAs(page, "admin");
    await page.goto("/student");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("teacher cannot access admin dashboard", async ({ page }) => {
    await loginAs(page, "teacher");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/teacher/);
  });

  test("student cannot access admin dashboard", async ({ page }) => {
    await loginAs(page, "student");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/student/);
  });

  test("student cannot access teacher dashboard", async ({ page }) => {
    await loginAs(page, "student");
    await page.goto("/teacher");
    await expect(page).toHaveURL(/\/student/);
  });

  test("parent cannot access admin dashboard", async ({ page }) => {
    await loginAs(page, "parent");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/parent/);
  });
});
