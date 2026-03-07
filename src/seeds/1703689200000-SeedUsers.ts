import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedUsers1703689200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Get roleIds for each role from dev_local schema
    const roles = await queryRunner.query(
      `SELECT id, "code" FROM "Roles" WHERE "code" IN ('admin', 'student', 'teacher')`
    );

    const roleMap: Record<string, string> = {};
    roles.forEach((role: any) => {
      roleMap[role.code] = role.id;
    });

    // Insert users matching dev_local schema structure
    // Column names: id, name, email, password, phoneNumber, roleId, isActive, createdAt, updatedAt
    await queryRunner.query(
      `INSERT INTO "Users" (id, "name", email, password, "phoneNumber", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES 
       ($1, $2, $3, $4, $5, $6, true, NOW(), NOW()),
       ($7, $8, $9, $10, $11, $12, true, NOW(), NOW()),
       ($13, $14, $15, $16, $17, $18, true, NOW(), NOW())`,
      [
        '550e8400-e29b-41d4-a716-446655440000',
        'Admin User',
        'admin@edunet.com',
        adminPassword,
        '0901234567',
        roleMap['admin'],

        '550e8400-e29b-41d4-a716-446655440001',
        'John Student',
        'student@edunet.com',
        userPassword,
        '0902345678',
        roleMap['student'],

        '550e8400-e29b-41d4-a716-446655440002',
        'Jane Teacher',
        'teacher@edunet.com',
        userPassword,
        '0903456789',
        roleMap['teacher'],
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete seeded users
    await queryRunner.query(
      `DELETE FROM "Users" WHERE email IN ('admin@edunet.com', 'student@edunet.com', 'teacher@edunet.com')`,
    );
  }
}
