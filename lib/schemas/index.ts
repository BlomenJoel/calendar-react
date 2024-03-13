import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const event = pgTable('event', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  start: timestamp('start', { withTimezone: true }).notNull(),
  end: timestamp('end', { withTimezone: true }).notNull(),
  allDay: boolean("allDay").notNull(),
});


export type Availability = typeof event.$inferSelect;
