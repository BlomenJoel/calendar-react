import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schemas/index.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_CONNECTION_STRING as string
  }
} satisfies Config;
