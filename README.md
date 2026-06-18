# EduLMS - Learning Management System

A full-stack Learning Management System built with Next.js 16, featuring role-based dashboards for administrators, teachers, students, and parents.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma 7 ORM
- **Authentication:** NextAuth v5 (Credentials provider, JWT sessions)
- **Styling:** Tailwind CSS 4
- **Runtime:** Edge-compatible middleware for route protection

## Features

### Admin Dashboard
- User management (create, delete, role assignment)
- Course overview and management
- Student enrollment and removal
- Grade overrides
- Parent-child linking

### Teacher Dashboard
- Course creation and publishing
- Module, lesson, and assignment management
- Submission grading with feedback
- Attendance logging
- Student progress report generation

### Student Dashboard
- Course browsing and enrollment
- Assignment viewing and file submission
- Grade tracking
- File upload for coursework

### Parent Dashboard
- View linked children's grades
- Attendance records
- Progress reports from teachers

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mehdi-Zafar/lms-app.git
   cd lms-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lms"
   AUTH_SECRET="your-auth-secret"
   ```

4. Push the database schema and seed demo data:

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Admin   | admin@school.edu    | password123 |
| Teacher | teacher@school.edu  | password123 |
| Student | student@school.edu  | password123 |
| Parent  | parent@school.edu   | password123 |

## Project Structure

```
src/
├── actions/           # Server actions (admin, teacher, student)
├── app/
│   ├── (dashboard)/   # Role-based dashboard routes
│   │   ├── admin/
│   │   ├── teacher/
│   │   ├── student/
│   │   └── parent/
│   ├── api/auth/      # NextAuth API route
│   └── login/         # Login page
├── components/
│   ├── dashboard/     # Dashboard layout components
│   └── ui/            # Reusable UI components
├── lib/
│   ├── auth.ts        # NextAuth configuration (server-side)
│   ├── auth.config.ts # Edge-compatible auth config
│   ├── auth-guard.ts  # Route protection helpers
│   ├── db.ts          # Prisma client
│   └── rbac.ts        # Role-based access control
└── types/             # TypeScript type declarations
```

## Available Scripts

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start development server with Turbopack  |
| `npm run build`  | Create production build                  |
| `npm run start`  | Start production server                  |
| `npm run lint`   | Run ESLint                               |
| `npm run db:push`| Push Prisma schema to database           |
| `npm run db:seed`| Seed database with demo data             |
| `npm run db:reset`| Reset database and re-seed              |

## License

This project is private and not licensed for public distribution.
