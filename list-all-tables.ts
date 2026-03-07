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
  
  // List all tables in dev_local
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'dev_local' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  
  console.log('All tables in dev_local schema:');
  res.rows.forEach(r => console.log(`  - ${r.table_name}`));
  
  await client.end();
})();
