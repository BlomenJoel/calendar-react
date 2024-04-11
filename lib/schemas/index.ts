import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const event = pgTable('event', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  start: timestamp('start', { withTimezone: true }).notNull(),
  end: timestamp('end', { withTimezone: true }).notNull(),
  allDay: boolean("allDay").notNull(),
});

export const user = pgTable("user", {
  id: uuid('id').primaryKey(),
})

export const role = pgTable("role", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').references(() => user.id).notNull(),
  title: varchar("title").notNull()
})

export const goal = pgTable("goal", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId'),
  title: varchar("title").notNull()
})
export type Availability = typeof event.$inferSelect;
