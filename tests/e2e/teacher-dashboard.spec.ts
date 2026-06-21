import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Teacher Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "teacher");
  });

  test("displays teacher dashboard", async ({ page }) => {
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("can navigate to courses page", async ({ page }) => {
    await page.getByRole("link", { name: "My Courses" }).click();
    await expect(page).toHaveURL(/\/teacher\/courses/);
  });

  test("can navigate to submissions page", async ({ page }) => {
    await page.getByRole("link", { name: "Submissions" }).click();
    await expect(page).toHaveURL(/\/teacher\/submissions/);
  });

  test("can navigate to attendance page", async ({ page }) => {
    await page.getByRole("link", { name: "Attendance" }).click();
    await expect(page).toHaveURL(/\/teacher\/attendance/);
  });

  test("can create a new course", async ({ page }) => {
    await page.getByRole("link", { name: "My Courses" }).click();
    await page.getByLabel("Title").fill("E2E Test Course");
    await page.getByLabel("Description").fill("This is a test course created by E2E tests");
    await page.getByRole("button", { name: "Create Course" }).click();
    await expect(page.getByText("E2E Test Course")).toBeVisible();
  });
});
