import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Parent Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "parent");
  });

  test("displays parent dashboard", async ({ page }) => {
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("can navigate to grades page", async ({ page }) => {
    await page.getByRole("link", { name: "Grades" }).click();
    await expect(page).toHaveURL(/\/parent\/grades/);
  });

  test("can navigate to attendance page", async ({ page }) => {
    await page.getByRole("link", { name: "Attendance" }).click();
    await expect(page).toHaveURL(/\/parent\/attendance/);
  });

  test("can navigate to reports page", async ({ page }) => {
    await page.getByRole("link", { name: "Reports" }).click();
    await expect(page).toHaveURL(/\/parent\/reports/);
  });
});
