import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.attendanceLog.deleteMany();
  await prisma.progressReport.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.parentChild.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: { name: "Sarah Admin", email: "admin@school.edu", password, role: "ADMIN" },
  });

  const teacher1 = await prisma.user.create({
    data: { name: "John Smith", email: "teacher@school.edu", password, role: "TEACHER" },
  });

  const teacher2 = await prisma.user.create({
    data: { name: "Emily Davis", email: "teacher2@school.edu", password, role: "TEACHER" },
  });

  const student1 = await prisma.user.create({
    data: { name: "Alex Johnson", email: "student@school.edu", password, role: "STUDENT" },
  });

  const student2 = await prisma.user.create({
    data: { name: "Maya Williams", email: "student2@school.edu", password, role: "STUDENT" },
  });

  const student3 = await prisma.user.create({
    data: { name: "Ryan Brown", email: "student3@school.edu", password, role: "STUDENT" },
  });

  const parent1 = await prisma.user.create({
    data: { name: "Linda Johnson", email: "parent@school.edu", password, role: "PARENT" },
  });

  const parent2 = await prisma.user.create({
    data: { name: "Robert Williams", email: "parent2@school.edu", password, role: "PARENT" },
  });

  await prisma.parentChild.createMany({
    data: [
      { parentId: parent1.id, childId: student1.id },
      { parentId: parent2.id, childId: student2.id },
    ],
  });

  const mathCourse = await prisma.course.create({
    data: {
      title: "Mathematics 101",
      description: "Introduction to algebra, geometry, and basic calculus concepts for high school students.",
      teacherId: teacher1.id,
      published: true,
    },
  });

  const mathModule1 = await prisma.module.create({
    data: { title: "Algebra Basics", order: 1, courseId: mathCourse.id, published: true },
  });

  const mathModule2 = await prisma.module.create({
    data: { title: "Geometry", order: 2, courseId: mathCourse.id, published: true },
  });

  await prisma.lesson.createMany({
    data: [
      { title: "Variables & Expressions", content: "Learn about variables, constants, and algebraic expressions.", videoUrl: "https://www.youtube.com/watch?v=NybHckSEQBI", order: 1, moduleId: mathModule1.id },
      { title: "Linear Equations", content: "Solving one-variable linear equations using inverse operations.", order: 2, moduleId: mathModule1.id },
      { title: "Quadratic Equations", content: "Factoring, completing the square, and the quadratic formula.", videoUrl: "https://www.youtube.com/watch?v=IlNAJl36-10", order: 3, moduleId: mathModule1.id },
      { title: "Points and Lines", content: "Understanding coordinates, distance formula, and slope.", order: 1, moduleId: mathModule2.id },
      { title: "Triangles and Circles", content: "Properties of triangles, Pythagorean theorem, and circle geometry.", videoUrl: "https://www.youtube.com/watch?v=s65dsW2FUTI", order: 2, moduleId: mathModule2.id },
    ],
  });

  const mathAssignment1 = await prisma.assignment.create({
    data: { title: "Algebra Problem Set 1", description: "Solve 20 linear equations showing all work steps.", dueDate: new Date("2026-07-01"), moduleId: mathModule1.id },
  });

  await prisma.assignment.create({
    data: { title: "Geometry Proofs", description: "Complete proofs for 5 triangle congruence problems.", dueDate: new Date("2026-07-15"), moduleId: mathModule2.id },
  });

  const engCourse = await prisma.course.create({
    data: {
      title: "English Literature",
      description: "Exploring classic and modern literature through critical analysis and creative writing.",
      teacherId: teacher1.id,
      published: true,
    },
  });

  const engModule1 = await prisma.module.create({
    data: { title: "Shakespeare", order: 1, courseId: engCourse.id, published: true },
  });

  await prisma.lesson.createMany({
    data: [
      { title: "Introduction to Shakespeare", content: "Overview of Shakespeare's life, works, and lasting impact on English literature.", order: 1, moduleId: engModule1.id },
      { title: "Romeo and Juliet", content: "A deep dive into themes of love, fate, and conflict.", videoUrl: "https://www.youtube.com/watch?v=dbrCxXaQDWk", order: 2, moduleId: engModule1.id },
    ],
  });

  const engAssignment1 = await prisma.assignment.create({
    data: { title: "Essay: Themes in Romeo & Juliet", description: "Write a 500-word essay analyzing the major themes.", dueDate: new Date("2026-07-10"), moduleId: engModule1.id },
  });

  const csCourse = await prisma.course.create({
    data: {
      title: "Intro to Computer Science",
      description: "Fundamentals of programming, algorithms, and computational thinking.",
      teacherId: teacher2.id,
      published: true,
    },
  });

  const csModule1 = await prisma.module.create({
    data: { title: "Programming Basics", order: 1, courseId: csCourse.id, published: true },
  });

  await prisma.lesson.createMany({
    data: [
      { title: "What is Programming?", content: "Introduction to programming concepts: variables, data types, and control flow.", order: 1, moduleId: csModule1.id },
      { title: "Functions and Loops", content: "Learn how to write reusable code with functions and iterate with loops.", videoUrl: "https://www.youtube.com/watch?v=jS4aFq5-91M", order: 2, moduleId: csModule1.id },
    ],
  });

  const csAssignment1 = await prisma.assignment.create({
    data: { title: "Build a Calculator", description: "Create a simple command-line calculator supporting +, -, *, /.", dueDate: new Date("2026-07-20"), moduleId: csModule1.id },
  });

  await prisma.enrollment.createMany({
    data: [
      { studentId: student1.id, courseId: mathCourse.id },
      { studentId: student1.id, courseId: engCourse.id },
      { studentId: student1.id, courseId: csCourse.id },
      { studentId: student2.id, courseId: mathCourse.id },
      { studentId: student2.id, courseId: csCourse.id },
      { studentId: student3.id, courseId: engCourse.id },
      { studentId: student3.id, courseId: csCourse.id },
    ],
  });

  await prisma.submission.createMany({
    data: [
      { studentId: student1.id, assignmentId: mathAssignment1.id, fileUrl: "/uploads/sample.pdf", fileName: "algebra-solutions.pdf", grade: 92, feedback: "Excellent work! Clear steps shown.", gradedById: teacher1.id },
      { studentId: student1.id, assignmentId: engAssignment1.id, fileUrl: "/uploads/sample.pdf", fileName: "romeo-juliet-essay.docx", grade: 85, feedback: "Good analysis, explore fate theme more.", gradedById: teacher1.id },
      { studentId: student2.id, assignmentId: mathAssignment1.id, fileUrl: "/uploads/sample.pdf", fileName: "math-homework.pdf", grade: 78, feedback: "Errors in problems 15-18. Review factoring.", gradedById: teacher1.id },
      { studentId: student3.id, assignmentId: csAssignment1.id, fileUrl: "/uploads/sample.zip", fileName: "calculator.zip" },
    ],
  });

  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (i + 1));
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "ABSENT"];

  for (const student of [student1, student2, student3]) {
    for (let i = 0; i < dates.length; i++) {
      await prisma.attendanceLog.create({
        data: {
          studentId: student.id,
          courseId: mathCourse.id,
          date: dates[i],
          status: statuses[(i + (student.id === student3.id ? 2 : 0)) % statuses.length],
        },
      });
    }
  }

  await prisma.progressReport.createMany({
    data: [
      { studentId: student1.id, authorId: teacher1.id, title: "Mid-Term Progress Report", content: "Alex is performing very well in both Mathematics and English. Strong analytical skills and consistent effort." },
      { studentId: student2.id, authorId: teacher1.id, title: "Mid-Term Progress Report", content: "Maya shows good understanding but could improve attention to detail in math. Recommend extra factoring practice." },
    ],
  });

  console.log("Seed complete!");
  console.log("\nDemo accounts (all passwords: password123):");
  console.log("  Admin:   admin@school.edu");
  console.log("  Teacher: teacher@school.edu / teacher2@school.edu");
  console.log("  Student: student@school.edu / student2@school.edu / student3@school.edu");
  console.log("  Parent:  parent@school.edu (child: Alex) / parent2@school.edu (child: Maya)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
