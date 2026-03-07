import * as dotenv from 'dotenv';
dotenv.config();
import { Client } from 'pg';

async function createSchema() {
  const client = new Client({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT as string) || 5432,
    database: process.env.DATABASE_DB,
  });

  try {
    await client.connect();
    
    const schemaName = process.env.DATABASE_SCHEMA || 'edunet';
    
    // Drop schema with cascade to remove all objects
    await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    console.log(`Schema "${schemaName}" dropped (if existed)`);
    
    // Create fresh schema
    await client.query(`CREATE SCHEMA "${schemaName}"`);
    console.log(`Schema "${schemaName}" created successfully`);
    
    await client.end();
  } catch (error) {
    console.error('Error creating schema:', error);
    process.exit(1);
  }
}

createSchema();
