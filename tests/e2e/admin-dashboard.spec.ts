import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("displays dashboard stats", async ({ page }) => {
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("can navigate to users page", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.getByText("User Management")).toBeVisible();
  });

  test("can navigate to courses page", async ({ page }) => {
    await page.getByRole("link", { name: "Courses" }).click();
    await expect(page).toHaveURL(/\/admin\/courses/);
  });

  test("can navigate to enrollments page", async ({ page }) => {
    await page.getByRole("link", { name: "Enrollments" }).click();
    await expect(page).toHaveURL(/\/admin\/enrollments/);
  });

  test("can create a new user", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await page.getByLabel("Name").fill("E2E Test User");
    await page.getByLabel("Email").fill(`e2e-${Date.now()}@test.edu`);
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Role").selectOption("STUDENT");
    await page.getByRole("button", { name: "Create User" }).click();
    await expect(page.getByText("E2E Test User")).toBeVisible();
  });
});
