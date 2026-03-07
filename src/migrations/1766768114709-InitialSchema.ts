import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1766768114709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ENUM types
        await queryRunner.query(`CREATE TYPE "public"."UserRole" AS ENUM ('student', 'teacher', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."Gender" AS ENUM ('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert')`);
        await queryRunner.query(`CREATE TYPE "public"."CourseStatus" AS ENUM ('draft', 'published', 'archived')`);
        await queryRunner.query(`CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('pending', 'active', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."LessonType" AS ENUM ('video', 'reading', 'quiz', 'assignment')`);
        await queryRunner.query(`CREATE TYPE "public"."MaterialType" AS ENUM ('pdf', 'video', 'document', 'link', 'image')`);
        await queryRunner.query(`CREATE TYPE "public"."AssignmentStatus" AS ENUM ('pending', 'submitted', 'graded', 'overdue')`);
        await queryRunner.query(`CREATE TYPE "public"."QuizStatus" AS ENUM ('not_started', 'in_progress', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."AttemptStatus" AS ENUM ('in_progress', 'completed', 'timed_out')`);
        await queryRunner.query(`CREATE TYPE "public"."ScheduleType" AS ENUM ('class', 'exam', 'assignment', 'event')`);
        await queryRunner.query(`CREATE TYPE "public"."TicketStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed')`);
        await queryRunner.query(`CREATE TYPE "public"."TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`CREATE TYPE "public"."TicketCategory" AS ENUM ('technical', 'billing', 'course', 'account', 'other')`);

        // Users table
        await queryRunner.query(`
            CREATE TABLE "Users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(255) NOT NULL,
                "password" character varying(255) NOT NULL,
                "firstName" character varying(100),
                "lastName" character varying(100),
                "phone" character varying(20),
                "avatar" text,
                "gender" "public"."Gender",
                "dateOfBirth" date,
                "address" text,
                "city" character varying(100),
                "country" character varying(100),
                "bio" text,
                "role" "public"."UserRole" NOT NULL DEFAULT 'student',
                "socialLinks" jsonb,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_Users_email" UNIQUE ("email"),
                CONSTRAINT "PK_Users" PRIMARY KEY ("id")
            )
        `);

        // Sessions table
        await queryRunner.query(`
            CREATE TABLE "Sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "refreshToken" text NOT NULL,
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "userAgent" text,
                "ipAddress" character varying(50),
                "isRevoked" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_Sessions" PRIMARY KEY ("id")
            )
        `);

        // PasswordResets table
        await queryRunner.query(`
            CREATE TABLE "PasswordResets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "token" character varying(255) NOT NULL,
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "isUsed" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_PasswordResets_token" UNIQUE ("token"),
                CONSTRAINT "PK_PasswordResets" PRIMARY KEY ("id")
            )
        `);

        // Categories table
        await queryRunner.query(`
            CREATE TABLE "Categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(255) NOT NULL,
                "description" text,
                "icon" text,
                "slug" character varying(255) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_Categories_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_Categories" PRIMARY KEY ("id")
            )
        `);

        // Courses table
        await queryRunner.query(`
            CREATE TABLE "Courses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "thumbnail" text,
                "price" decimal(10,2) NOT NULL DEFAULT 0,
                "discountPrice" decimal(10,2),
                "duration" integer NOT NULL DEFAULT 0,
                "totalLessons" integer NOT NULL DEFAULT 0,
                "level" "public"."CourseLevel" NOT NULL DEFAULT 'beginner',
                "status" "public"."CourseStatus" NOT NULL DEFAULT 'draft',
                "language" character varying(50) DEFAULT 'Vietnamese',
                "tags" jsonb,
                "schedule" character varying(255),
                "hours" character varying(50),
                "startDate" date,
                "categoryId" uuid,
                "teacherId" uuid,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Courses" PRIMARY KEY ("id")
            )
        `);

        // Enrollments table
        await queryRunner.query(`
            CREATE TABLE "Enrollments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "courseId" uuid NOT NULL,
                "studentId" uuid NOT NULL,
                "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'pending',
                "progress" integer NOT NULL DEFAULT 0,
                "enrolledAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "completedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Enrollments" PRIMARY KEY ("id")
            )
        `);

        // Lessons table
        await queryRunner.query(`
            CREATE TABLE "Lessons" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "content" text,
                "type" "public"."LessonType" NOT NULL DEFAULT 'video',
                "duration" integer NOT NULL DEFAULT 0,
                "order" integer NOT NULL DEFAULT 0,
                "videoUrl" text,
                "isPreview" boolean NOT NULL DEFAULT false,
                "courseId" uuid NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Lessons" PRIMARY KEY ("id")
            )
        `);

        // Materials table
        await queryRunner.query(`
            CREATE TABLE "Materials" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "type" "public"."MaterialType" NOT NULL DEFAULT 'pdf',
                "downloadUrl" text NOT NULL,
                "size" character varying(50),
                "courseId" uuid NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Materials" PRIMARY KEY ("id")
            )
        `);

        // Assignments table
        await queryRunner.query(`
            CREATE TABLE "Assignments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "dueDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "status" "public"."AssignmentStatus" NOT NULL DEFAULT 'pending',
                "grade" decimal(5,2),
                "maxGrade" decimal(5,2) NOT NULL DEFAULT 100,
                "attachments" jsonb,
                "feedback" text,
                "submissionUrl" text,
                "submittedAt" TIMESTAMP WITH TIME ZONE,
                "courseId" uuid NOT NULL,
                "studentId" uuid,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Assignments" PRIMARY KEY ("id")
            )
        `);

        // Quizzes table
        await queryRunner.query(`
            CREATE TABLE "Quizzes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "duration" integer NOT NULL DEFAULT 30,
                "questions" jsonb,
                "totalQuestions" integer NOT NULL DEFAULT 0,
                "maxAttempts" integer NOT NULL DEFAULT 1,
                "passingScore" decimal(5,2) NOT NULL DEFAULT 70,
                "shuffleQuestions" boolean NOT NULL DEFAULT true,
                "showCorrectAnswers" boolean NOT NULL DEFAULT true,
                "courseId" uuid NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Quizzes" PRIMARY KEY ("id")
            )
        `);

        // QuizAttempts table
        await queryRunner.query(`
            CREATE TABLE "QuizAttempts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "quizId" uuid NOT NULL,
                "studentId" uuid NOT NULL,
                "answers" jsonb,
                "score" decimal(5,2),
                "correctAnswers" integer NOT NULL DEFAULT 0,
                "totalAnswered" integer NOT NULL DEFAULT 0,
                "status" "public"."AttemptStatus" NOT NULL DEFAULT 'in_progress',
                "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "completedAt" TIMESTAMP WITH TIME ZONE,
                "timeSpent" integer NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_QuizAttempts" PRIMARY KEY ("id")
            )
        `);

        // Reviews table
        await queryRunner.query(`
            CREATE TABLE "Reviews" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "rating" integer NOT NULL,
                "comment" text,
                "isVisible" boolean NOT NULL DEFAULT true,
                "courseId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Reviews" PRIMARY KEY ("id")
            )
        `);

        // Schedules table
        await queryRunner.query(`
            CREATE TABLE "Schedules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(500) NOT NULL,
                "description" text,
                "type" "public"."ScheduleType" NOT NULL DEFAULT 'class',
                "date" date NOT NULL,
                "startTime" time NOT NULL,
                "endTime" time NOT NULL,
                "location" character varying(255),
                "meetingLink" character varying(500),
                "isOnline" boolean NOT NULL DEFAULT false,
                "courseId" uuid,
                "teacherId" uuid,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_Schedules" PRIMARY KEY ("id")
            )
        `);

        // SupportTickets table
        await queryRunner.query(`
            CREATE TABLE "SupportTickets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "subject" character varying(500) NOT NULL,
                "message" text NOT NULL,
                "status" "public"."TicketStatus" NOT NULL DEFAULT 'open',
                "priority" "public"."TicketPriority" NOT NULL DEFAULT 'medium',
                "category" "public"."TicketCategory" NOT NULL DEFAULT 'other',
                "attachments" jsonb,
                "response" text,
                "respondedAt" TIMESTAMP WITH TIME ZONE,
                "userId" uuid NOT NULL,
                "assignedToId" uuid,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_SupportTickets" PRIMARY KEY ("id")
            )
        `);

        // Create uuid-ossp extension for uuid_generate_v4
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create indexes
        await queryRunner.query(`CREATE INDEX "IDX_Users_email" ON "Users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_Users_role" ON "Users" ("role")`);
        await queryRunner.query(`CREATE INDEX "IDX_Sessions_userId" ON "Sessions" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Courses_categoryId" ON "Courses" ("categoryId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Courses_teacherId" ON "Courses" ("teacherId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Courses_status" ON "Courses" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_Enrollments_courseId" ON "Enrollments" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Enrollments_studentId" ON "Enrollments" ("studentId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Lessons_courseId" ON "Lessons" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Materials_courseId" ON "Materials" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Assignments_courseId" ON "Assignments" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Quizzes_courseId" ON "Quizzes" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Reviews_courseId" ON "Reviews" ("courseId")`);
        await queryRunner.query(`CREATE INDEX "IDX_Schedules_date" ON "Schedules" ("date")`);
        await queryRunner.query(`CREATE INDEX "IDX_SupportTickets_status" ON "SupportTickets" ("status")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "SupportTickets"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Schedules"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Reviews"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "QuizAttempts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Quizzes"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Assignments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Materials"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Lessons"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Enrollments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Courses"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "PasswordResets"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Sessions"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Users"`);

        // Drop ENUM types
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."TicketCategory"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."TicketPriority"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."TicketStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."ScheduleType"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."AttemptStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."QuizStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."AssignmentStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."MaterialType"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."LessonType"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."EnrollmentStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."CourseStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."CourseLevel"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."Gender"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."UserRole"`);
    }

}
