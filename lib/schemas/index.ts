import { doublePrecision, pgTable, uuid, varchar, smallint } from 'drizzle-orm/pg-core';

export const event = pgTable('event', {
  id: uuid('id').defaultRandom().primaryKey(),
});


export type Availability = typeof event.$inferSelect;
