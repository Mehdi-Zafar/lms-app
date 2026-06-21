import { test, expect } from "@playwright/test";
import { loginAs, ACCOUNTS } from "./helpers/auth";

test.describe("Authentication", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("wrong@email.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("admin login redirects to admin dashboard", async ({ page }) => {
    await loginAs(page, "admin");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("teacher login redirects to teacher dashboard", async ({ page }) => {
    await loginAs(page, "teacher");
    await expect(page).toHaveURL(/\/teacher/);
  });

  test("student login redirects to student dashboard", async ({ page }) => {
    await loginAs(page, "student");
    await expect(page).toHaveURL(/\/student/);
  });

  test("parent login redirects to parent dashboard", async ({ page }) => {
    await loginAs(page, "parent");
    await expect(page).toHaveURL(/\/parent/);
  });

  test("logout redirects to login page", async ({ page }) => {
    await loginAs(page, "admin");
    await page.getByTitle("Sign out").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
