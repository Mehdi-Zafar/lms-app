import { describe, it, expect } from "vitest";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts with last value winning", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-03-15"));
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats a date string", () => {
    const result = formatDate("2024-12-25");
    expect(result).toContain("Dec");
    expect(result).toContain("25");
    expect(result).toContain("2024");
  });
});

describe("formatDateTime", () => {
  it("formats a date with time", () => {
    const result = formatDateTime(new Date("2024-03-15T14:30:00"));
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2024");
    expect(result).toContain("2:30");
  });
});
