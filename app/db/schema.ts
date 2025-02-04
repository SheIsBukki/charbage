import { text, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const sessionTable = pgTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, {onDelete:"cascade"}),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull()
});

export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: varchar("password"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  }).defaultNow()
});

export type Session = InferSelectModel<typeof sessionTable>;
export type User = InferSelectModel<typeof userTable>;

