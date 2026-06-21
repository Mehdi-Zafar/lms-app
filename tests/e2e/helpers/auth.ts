import { type Page } from "@playwright/test";

const ACCOUNTS = {
  admin: { email: "admin@school.edu", password: "password123", dashboard: "/admin" },
  teacher: { email: "teacher@school.edu", password: "password123", dashboard: "/teacher" },
  student: { email: "student@school.edu", password: "password123", dashboard: "/student" },
  parent: { email: "parent@school.edu", password: "password123", dashboard: "/parent" },
} as const;

export type Role = keyof typeof ACCOUNTS;

export async function loginAs(page: Page, role: Role) {
  const account = ACCOUNTS[role];
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(account.dashboard + "**");
}

export { ACCOUNTS };
