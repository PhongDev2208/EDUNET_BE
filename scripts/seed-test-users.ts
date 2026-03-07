import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'longpc',
    password: 'SAOLON0123',
    database: 'thien_kim_cms_db'
  });

  await client.connect();

  try {
    // Get admin role ID
    const adminRoleRes = await client.query(
      `SELECT id FROM "Roles" WHERE "code" = 'admin' LIMIT 1`
    );
    const adminRoleId = adminRoleRes.rows[0]?.id;

    // Get student role ID
    const studentRoleRes = await client.query(
      `SELECT id FROM "Roles" WHERE "code" = 'student' LIMIT 1`
    );
    const studentRoleId = studentRoleRes.rows[0]?.id;

    // Get teacher role ID
    const teacherRoleRes = await client.query(
      `SELECT id FROM "Roles" WHERE "code" = 'teacher' LIMIT 1`
    );
    const teacherRoleId = teacherRoleRes.rows[0]?.id;

    if (!adminRoleId || !studentRoleId || !teacherRoleId) {
      console.error('Required roles not found in database');
      process.exit(1);
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Insert admin user
    await client.query(
      `INSERT INTO "Users" (id, "name", email, password, "phoneNumber", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [
        '550e8400-e29b-41d4-a716-446655440000',
        'Admin User',
        'admin@edunet.com',
        adminPassword,
        '0901234567',
        adminRoleId,
        true,
      ]
    );
    console.log('✓ Admin user created');

    // Insert student user
    await client.query(
      `INSERT INTO "Users" (id, "name", email, password, "phoneNumber", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [
        '550e8400-e29b-41d4-a716-446655440001',
        'John Student',
        'student@edunet.com',
        userPassword,
        '0902345678',
        studentRoleId,
        true,
      ]
    );
    console.log('✓ Student user created');

    // Insert teacher user
    await client.query(
      `INSERT INTO "Users" (id, "name", email, password, "phoneNumber", "roleId", "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [
        '550e8400-e29b-41d4-a716-446655440002',
        'Jane Teacher',
        'teacher@edunet.com',
        userPassword,
        '0903456789',
        teacherRoleId,
        true,
      ]
    );
    console.log('✓ Teacher user created');

    console.log('\n✅ All test users have been created successfully!');
    console.log('\nTest credentials:');
    console.log('  Admin:   admin@edunet.com / admin123');
    console.log('  Student: student@edunet.com / user123');
    console.log('  Teacher: teacher@edunet.com / user123');

    await client.end();
  } catch (error) {
    console.error('Error:', (error as any).message);
    await client.end();
    process.exit(1);
  }
})();
