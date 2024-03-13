import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrationClient } from './db';
import * as schema from './schemas';

const db = drizzle(migrationClient, { schema });

await migrate(db, { migrationsFolder: 'migrations' });
migrationClient.end();
