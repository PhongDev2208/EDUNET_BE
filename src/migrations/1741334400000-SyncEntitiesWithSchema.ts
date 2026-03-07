import { MigrationInterface, QueryRunner } from 'typeorm';

export class SyncEntitiesWithSchema1741334400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== 1. Fix CourseStatus enum (add: pending, approved, rejected) =====
    // Use rename+recreate approach for transaction safety
    await queryRunner.query(`ALTER TYPE "public"."CourseStatus" RENAME TO "CourseStatus_old"`);
    await queryRunner.query(`CREATE TYPE "public"."CourseStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'published', 'archived')`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Courses"
      ALTER COLUMN "status" TYPE "public"."CourseStatus"
      USING "status"::text::"public"."CourseStatus"
    `);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    await queryRunner.query(`DROP TYPE "public"."CourseStatus_old"`);

    // ===== 2. Fix CourseLevel enum (replace 'expert' with 'all') =====
    await queryRunner.query(`ALTER TYPE "public"."CourseLevel" RENAME TO "CourseLevel_old"`);
    await queryRunner.query(`CREATE TYPE "public"."CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'all')`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "level" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Courses"
      ALTER COLUMN "level" TYPE "public"."CourseLevel"
      USING (
        CASE "level"::text
          WHEN 'expert' THEN 'advanced'::"public"."CourseLevel"
          ELSE "level"::text::"public"."CourseLevel"
        END
      )
    `);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "level" SET DEFAULT 'all'`);
    await queryRunner.query(`DROP TYPE "public"."CourseLevel_old"`);

    // ===== 3. Add missing columns to Courses =====
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "totalStudents" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "rating" decimal(2,1) NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "totalReviews" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "goal" text`);

    // ===== 4. Change Courses.duration from integer to varchar(50) =====
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" TYPE character varying(50) USING "duration"::character varying`);

    // ===== 5. Fix EnrollmentStatus enum =====
    await queryRunner.query(`ALTER TYPE "public"."EnrollmentStatus" RENAME TO "EnrollmentStatus_old"`);
    await queryRunner.query(`CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('active', 'completed', 'dropped', 'expired')`);
    await queryRunner.query(`ALTER TABLE "Enrollments" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Enrollments"
      ALTER COLUMN "status" TYPE "public"."EnrollmentStatus"
      USING (
        CASE "status"::text
          WHEN 'pending' THEN 'active'::"public"."EnrollmentStatus"
          WHEN 'cancelled' THEN 'dropped'::"public"."EnrollmentStatus"
          ELSE "status"::text::"public"."EnrollmentStatus"
        END
      )
    `);
    await queryRunner.query(`ALTER TABLE "Enrollments" ALTER COLUMN "status" SET DEFAULT 'active'`);
    await queryRunner.query(`DROP TYPE "public"."EnrollmentStatus_old"`);

    // ===== 6. Rename Enrollments.studentId -> userId =====
    await queryRunner.query(`ALTER TABLE "Enrollments" RENAME COLUMN "studentId" TO "userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_Enrollments_studentId"`);
    await queryRunner.query(`CREATE INDEX "IDX_Enrollments_userId" ON "Enrollments" ("userId")`);

    // ===== 7. Add lastAccessedAt, drop enrolledAt from Enrollments =====
    await queryRunner.query(`ALTER TABLE "Enrollments" ADD COLUMN IF NOT EXISTS "lastAccessedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "Enrollments" DROP COLUMN IF EXISTS "enrolledAt"`);

    // ===== 8. Fix Lessons: rename isPreview -> isFree, change duration type =====
    await queryRunner.query(`ALTER TABLE "Lessons" RENAME COLUMN "isPreview" TO "isFree"`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" TYPE character varying(50) USING "duration"::character varying`);

    // ===== 9. Fix Categories: rename icon -> image, add order column =====
    await queryRunner.query(`ALTER TABLE "Categories" RENAME COLUMN "icon" TO "image"`);
    await queryRunner.query(`ALTER TABLE "Categories" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0`);

    // ===== 10. Fix Courses.tags: jsonb -> text (TypeORM simple-array) =====
    // Subqueries aren't allowed in ALTER TYPE USING, so convert data first then change type
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN "tags_text" text`);
    await queryRunner.query(`UPDATE "Courses" SET "tags_text" = array_to_string(ARRAY(SELECT jsonb_array_elements_text("tags")), ',') WHERE "tags" IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "Courses" RENAME COLUMN "tags_text" TO "tags"`);

    // ===== 11. Fix Courses.schedule: varchar(255) -> text (TypeORM simple-array) =====
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "schedule" TYPE text`);

    // ===== 12. Fix Courses.startDate: date -> timestamp with time zone =====
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "startDate" TYPE TIMESTAMP WITH TIME ZONE USING "startDate"::TIMESTAMP WITH TIME ZONE`);

    // ===== 13. Drop Courses.hours (not in entity) =====
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "hours"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ===== Revert Courses.hours, startDate, schedule, tags =====
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN IF NOT EXISTS "hours" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "startDate" TYPE date USING "startDate"::date`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "schedule" TYPE character varying(255)`);

    // Revert tags: text -> jsonb (use add-column approach to avoid subquery issue)
    await queryRunner.query(`ALTER TABLE "Courses" ADD COLUMN "tags_jsonb" jsonb`);
    await queryRunner.query(`UPDATE "Courses" SET "tags_jsonb" = to_jsonb(string_to_array("tags", ',')) WHERE "tags" IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "Courses" RENAME COLUMN "tags_jsonb" TO "tags"`);

    // ===== Revert Categories =====
    await queryRunner.query(`ALTER TABLE "Categories" DROP COLUMN IF EXISTS "order"`);
    await queryRunner.query(`ALTER TABLE "Categories" RENAME COLUMN "image" TO "icon"`);

    // ===== Revert Lessons =====
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" TYPE integer USING COALESCE(NULLIF("duration",'')::integer, 0)`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Lessons" ALTER COLUMN "duration" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "Lessons" RENAME COLUMN "isFree" TO "isPreview"`);

    // ===== Revert Enrollments =====
    await queryRunner.query(`ALTER TABLE "Enrollments" DROP COLUMN IF EXISTS "lastAccessedAt"`);
    await queryRunner.query(`ALTER TABLE "Enrollments" ADD COLUMN IF NOT EXISTS "enrolledAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_Enrollments_userId"`);
    await queryRunner.query(`ALTER TABLE "Enrollments" RENAME COLUMN "userId" TO "studentId"`);
    await queryRunner.query(`CREATE INDEX "IDX_Enrollments_studentId" ON "Enrollments" ("studentId")`);

    // Revert EnrollmentStatus enum
    await queryRunner.query(`ALTER TYPE "public"."EnrollmentStatus" RENAME TO "EnrollmentStatus_old"`);
    await queryRunner.query(`CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('pending', 'active', 'completed', 'cancelled')`);
    await queryRunner.query(`ALTER TABLE "Enrollments" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Enrollments"
      ALTER COLUMN "status" TYPE "public"."EnrollmentStatus"
      USING (
        CASE "status"::text
          WHEN 'dropped' THEN 'cancelled'::"public"."EnrollmentStatus"
          WHEN 'expired' THEN 'cancelled'::"public"."EnrollmentStatus"
          ELSE "status"::text::"public"."EnrollmentStatus"
        END
      )
    `);
    await queryRunner.query(`ALTER TABLE "Enrollments" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    await queryRunner.query(`DROP TYPE "public"."EnrollmentStatus_old"`);

    // ===== Revert Courses =====
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" TYPE integer USING COALESCE(NULLIF("duration",'')::integer, 0)`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "duration" SET DEFAULT 0`);

    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "goal"`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "publishedAt"`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "totalReviews"`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "rating"`);
    await queryRunner.query(`ALTER TABLE "Courses" DROP COLUMN IF EXISTS "totalStudents"`);

    // Revert CourseLevel enum
    await queryRunner.query(`ALTER TYPE "public"."CourseLevel" RENAME TO "CourseLevel_old"`);
    await queryRunner.query(`CREATE TYPE "public"."CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert')`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "level" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Courses"
      ALTER COLUMN "level" TYPE "public"."CourseLevel"
      USING (
        CASE "level"::text
          WHEN 'all' THEN 'beginner'::"public"."CourseLevel"
          ELSE "level"::text::"public"."CourseLevel"
        END
      )
    `);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "level" SET DEFAULT 'beginner'`);
    await queryRunner.query(`DROP TYPE "public"."CourseLevel_old"`);

    // Revert CourseStatus enum
    await queryRunner.query(`ALTER TYPE "public"."CourseStatus" RENAME TO "CourseStatus_old"`);
    await queryRunner.query(`CREATE TYPE "public"."CourseStatus" AS ENUM ('draft', 'published', 'archived')`);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`
      ALTER TABLE "Courses"
      ALTER COLUMN "status" TYPE "public"."CourseStatus"
      USING (
        CASE "status"::text
          WHEN 'pending' THEN 'draft'::"public"."CourseStatus"
          WHEN 'approved' THEN 'draft'::"public"."CourseStatus"
          WHEN 'rejected' THEN 'draft'::"public"."CourseStatus"
          ELSE "status"::text::"public"."CourseStatus"
        END
      )
    `);
    await queryRunner.query(`ALTER TABLE "Courses" ALTER COLUMN "status" SET DEFAULT 'draft'`);
    await queryRunner.query(`DROP TYPE "public"."CourseStatus_old"`);
  }
}
