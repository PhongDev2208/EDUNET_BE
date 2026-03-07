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
  
  // Check Users table in each schema
  for (const schema of ['dev_local', 'edunet', 'public']) {
    try {
      const tables = await client.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = $1 AND table_name = 'Users'
        ) as exists
      `, [schema]);
      if (tables.rows[0].exists) {
        console.log(`Users table EXISTS in ${schema}`);
      }
    } catch (e) {
      console.log(`Error checking ${schema}:`, (e as any).message.slice(0, 50));
    }
  }
  
  // Drop Users table from edunet if it exists
  try {
    await client.query('DROP TABLE IF EXISTS edunet."Users" CASCADE');
    console.log('Dropped Users table from edunet (if it existed)');
  } catch (e) {
    console.log('Error dropping table:', (e as any).message);
  }
  
  await client.end();
})();
