import {
  pgTable, uuid, varchar, boolean, timestamp, text,
  primaryKey,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from "next-auth/adapters"
import { relations } from 'drizzle-orm';
import { randomUUID } from "crypto"

export const event = pgTable('event', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goalId'),
  completed: boolean("completed").notNull().default(false),
  title: varchar("title").notNull(),
  start: timestamp('start', { withTimezone: true }).notNull(),
  end: timestamp('end', { withTimezone: true }).notNull(),
  allDay: boolean("allDay").notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdTimestamp: timestamp('timestamp').defaultNow().notNull(),
  startTimestamp: timestamp('startTimestamp').notNull(),
  endTimestamp: timestamp('endTimestamp').notNull(),
});

export const roleScores = pgTable("role_scores", {
  id: uuid('id').defaultRandom().primaryKey(),
  evaluationId: uuid('evaluationId')
    .notNull()
    .references(() => evaluations.id, { onDelete: "cascade" }),
  roleId: uuid('roleId')
    .notNull()
    .references(() => role.id, { onDelete: "cascade" }),
  desiredScore: integer('desiredScore').notNull(),
  currentScore: integer('currentScore').notNull(),
});


export const role = pgTable("role", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: varchar("description"),
  color: varchar("color").notNull().default('#000000'),
})

export const evaluationsRelations = relations(evaluations, ({ many }) => ({
  roleScores: many(roleScores),
}));

export const roleScoresRelations = relations(roleScores, ({ one }) => ({
  evaluation: one(evaluations, {
    fields: [roleScores.evaluationId],
    references: [evaluations.id],
  }),
  role: one(role, {
    fields: [roleScores.roleId],
    references: [role.id],
  }),
}));

export const goal = pgTable("goal", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("roleId")
    .notNull()
    .references(() => role.id, { onDelete: "cascade" }), // This defines the one-to-many relationship
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
})


export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    userIdIdx: index().on(account.userId),
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
},
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
    }
  }
)


export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)