# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to PostgreSQL
npm run db:seed      # Seed demo data (npx tsx prisma/seed.mts)
npm run db:reset     # Reset DB + re-seed
npx prisma generate  # Regenerate Prisma client after schema changes
```

## Architecture

**Next.js 16 App Router** with four role-based dashboards under `src/app/(dashboard)/{admin,teacher,student,parent}/`. Each dashboard has its own layout that enforces role access via `requireRole()` from `src/lib/auth-guard.ts`.

**Auth**: NextAuth v5 with credentials provider, JWT strategy. Auth config is split: `src/lib/auth.config.ts` (edge-compatible, used by middleware) and `src/lib/auth.ts` (server-side, does DB lookups via Prisma). User role is stored in the JWT token and available on `session.user.role`.

**RBAC**: `src/lib/rbac.ts` defines a permission map (`Permission` → allowed roles). Use `hasPermission(role, permission)` for authorization checks. Route protection is defined in `PROTECTED_ROUTES` (role → path prefix).

**Server Actions**: Business logic lives in `src/actions/{admin,teacher,student}.ts` — these are server actions grouped by role.

**Database**: PostgreSQL via Prisma 7. Schema at `prisma/schema.prisma`. Prisma client output is `src/generated/prisma`. Key models: User (with role string), Course, Module, Lesson, Assignment, Submission, Enrollment, AttendanceLog, ProgressReport, ParentChild.

**Path alias**: `@/*` maps to `./src/*`.

## Demo Accounts

All passwords: `password123`
- admin@school.edu / teacher@school.edu / student@school.edu / parent@school.edu

## Environment Variables

Requires `.env` with `DATABASE_URL` (PostgreSQL connection string) and `AUTH_SECRET`.
