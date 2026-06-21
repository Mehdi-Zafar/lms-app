import { vi } from "vitest";

export const mockDb = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  course: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  module: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  lesson: {
    create: vi.fn(),
  },
  assignment: {
    create: vi.fn(),
  },
  enrollment: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  submission: {
    create: vi.fn(),
    update: vi.fn(),
  },
  attendanceLog: {
    upsert: vi.fn(),
  },
  progressReport: {
    create: vi.fn(),
  },
  parentChild: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));
