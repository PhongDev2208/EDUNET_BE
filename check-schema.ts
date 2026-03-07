import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

(async () => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'longpc',
    password: 'SAOLON0123',
    database: 'thien_kim_cms_db'
  });

  await client.connect();
  
  const res = await client.query(`
    SELECT schema_name FROM information_schema.schemata 
    WHERE schema_name IN ('dev_local', 'edunet', 'public')
  `);
  
  console.log('Schemas:', res.rows.map((r: any) => r.schema_name).join(', '));
  
  // Check tables in each schema
  for (const schema of ['dev_local', 'edunet', 'public']) {
    try {
      const tables = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = $1 AND table_type = 'BASE TABLE'
      `, [schema]);
      if (tables.rows.length > 0) {
        console.log(`Tables in ${schema}:`, tables.rows.map((r: any) => r.table_name).slice(0, 5).join(', '));
      }
    } catch (e) {
      console.log(`${schema}: not accessible`);
    }
  }
  
  await client.end();
})();
