import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

if (!CONNECTION_STRING) {
  throw new Error('No DB connection string provided');
}

const migrationClient = postgres(CONNECTION_STRING, { max: 1 });

const client = postgres(CONNECTION_STRING);
const db = drizzle(client, { schema });

export {
  client as queryClient,
  db,
  migrationClient
}
