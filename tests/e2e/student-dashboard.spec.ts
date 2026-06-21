import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Student Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "student");
  });

  test("displays student dashboard", async ({ page }) => {
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("can navigate to courses page", async ({ page }) => {
    await page.getByRole("link", { name: "My Courses" }).click();
    await expect(page).toHaveURL(/\/student\/courses/);
  });

  test("can navigate to assignments page", async ({ page }) => {
    await page.getByRole("link", { name: "Assignments" }).click();
    await expect(page).toHaveURL(/\/student\/assignments/);
  });

  test("can navigate to grades page", async ({ page }) => {
    await page.getByRole("link", { name: "My Grades" }).click();
    await expect(page).toHaveURL(/\/student\/grades/);
  });

  test("can view enrolled courses", async ({ page }) => {
    await page.getByRole("link", { name: "My Courses" }).click();
    await expect(page.locator("main")).toBeVisible();
  });
});
