import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import './envConfig';

const db = drizzle(sql)
export {
    db
}
