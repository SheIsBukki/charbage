import { text, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const sessionTable = pgTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: varchar("password"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const postTable = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  slug: text("slug").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),

  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export type Session = InferSelectModel<typeof sessionTable>;
export type User = InferSelectModel<typeof userTable>;
export type Post = InferSelectModel<typeof postTable>;

// export type InsertPost = typeof postTable.$inferInsert;
