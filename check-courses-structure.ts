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
  
  // Check Courses table columns
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'dev_local' AND table_name = 'Courses'
    ORDER BY ordinal_position
  `);
  
  console.log('Courses table columns in dev_local:');
  res.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}`));
  
  // Check if Categories table exists
  const categories = await client.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'dev_local' AND table_name = 'Categories'
    ) as exists
  `);
  
  console.log('\nCategories table exists:', categories.rows[0].exists);
  
  if (categories.rows[0].exists) {
    const catRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'dev_local' AND table_name = 'Categories'
      ORDER BY ordinal_position
    `);
    
    console.log('Categories table columns:');
    catRes.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}`));
  }
  
  await client.end();
})();
