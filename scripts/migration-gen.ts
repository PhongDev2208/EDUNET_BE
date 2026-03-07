import { exec } from 'child_process';
import * as path from 'path';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: npm run migration:create:name -- <MigrationName>');
  process.exit(1);
}

const migrationPath = path.join('src', 'migrations', migrationName);

const command = `npx typeorm migration:create ${migrationPath}`;

console.log(`Creating migration: ${migrationName}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(stdout);
  console.log(`Migration created successfully`);
});
