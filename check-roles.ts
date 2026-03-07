import { Client } from 'pg';

(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'longpc',
    password: 'SAOLON0123',
    database: 'thien_kim_cms_db'
  });

  await client.connect();
  
  // Check Roles table columns
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'dev_local' AND table_name = 'Roles'
    ORDER BY ordinal_position
  `);
  
  console.log('Roles table columns:');
  res.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}`));
  
  // Get all roles
  const roles = await client.query(`SELECT * FROM "Roles"`);
  console.log('\nRoles:');
  console.log(roles.rows);
  
  await client.end();
})();
