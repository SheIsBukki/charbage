import {
  text,
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

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
  serialNumber: serial("serialNumber").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  githubUserId: integer("githubUserId"),
  googleUserId: text("googleUserId"),
  password: varchar("password"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const profileTable = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  avatar: text("avatar"),
  bio: text("bio"),
  about: text("about"),
  slug: text("slug"),
  socialLinks: text("socialLinks"), // THIS IS A JSON string of an object actually, so it must be parsed when fetched
  // AUTOMATICALLY CREATED WHEN A USER REGISTERS
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 }),

  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const postTable = pgTable("posts", {
  serialNumber: serial("serialNumber").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  featuredImage: text("featuredImage"),
  slug: text("slug").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .defaultNow(),

  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const postTableRelations = relations(postTable, ({ many }) => ({
  tagsToPostsTable: many(tagsToPostsTable),
}));

export const tagTable = pgTable("tags", {
  serialNumber: serial("serialNumber").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  slug: text("slug").notNull(), // Not sure that I need a slug since the tag.name is unique
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id),
});

export const tagTableRelations = relations(tagTable, ({ many }) => ({
  tagsToPostsTable: many(tagsToPostsTable),
}));

export const tagsToPostsTable = pgTable(
  "tagsToPostsTable",
  {
    postId: uuid("postId")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),

    tagId: uuid("tagId")
      .notNull()
      .references(() => tagTable.id),
  },
  (t) => [primaryKey({ columns: [t.tagId, t.postId] })],
);

export const tagsToPostsRelations = relations(tagsToPostsTable, ({ one }) => ({
  tag: one(tagTable, {
    fields: [tagsToPostsTable.tagId],
    references: [tagTable.id],
  }),
  post: one(postTable, {
    fields: [tagsToPostsTable.postId],
    references: [postTable.id],
  }),
}));

export const commentTable = pgTable("comments", {
  serialNumber: serial("serialNumber").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", precision: 3 })
    .$onUpdate(() => new Date())
    .defaultNow(),
  postId: uuid("postId")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const likeTable = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  postId: uuid("postId")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const bookmarkTable = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  postId: uuid("postId")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export type Session = InferSelectModel<typeof sessionTable>;
export type User = InferSelectModel<typeof userTable>;
export type Profile = InferSelectModel<typeof profileTable>;
export type Post = InferSelectModel<typeof postTable>;
export type Comment = InferSelectModel<typeof commentTable>;
export type Like = InferSelectModel<typeof likeTable>;
export type Bookmark = InferSelectModel<typeof bookmarkTable>;
export type Tag = InferSelectModel<typeof tagTable>;
export type TagsToPosts = InferSelectModel<typeof tagsToPostsTable>;

export type InsertComment = typeof commentTable.$inferInsert;
export type InsertTag = typeof tagTable.$inferInsert;
export type InsertPost = InferInsertModel<typeof postTable>;

/**
 * tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
    
 * */

/**
 * I think comments is not necessary here
  comments: text("comments")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  likes: text("likes")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  books: text("bookmarks")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
 * */
