"use server";

import {
  Post,
  postTable,
  Tag,
  tagsToPostsTable,
  tagTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { asc, between, count, eq, getTableColumns, sql } from "drizzle-orm";
import handleDatabaseOperation from "@/utils/handleDatabaseOperation";

export async function getUserWithId(id: User["id"]) {
  try {
    const { githubUserId, googleUserId, password, ...rest } =
      getTableColumns(userTable);

    const [user] = await db
      .select({ ...rest, postsCount: count(postTable.id) })
      .from(userTable)
      .where(eq(userTable.id, id))
      .leftJoin(postTable, eq(userTable.id, postTable.userId))
      .groupBy(userTable.id)
      .execute();

    return { user, error: null };
  } catch (error) {
    console.error("User could not be found", error);
    return { user: null, error: "Failed to find user" };
  }
}

// I might have to use the getPostsByUser instead to know the postCount of a user

export async function getPostsByUser(
  id: User["id"],
  page = 1, // Not sure whether I need to limit
  pageSize = 5,
): Promise<Array<Post>> {
  return db
    .select({ ...getTableColumns(postTable) })
    .from(postTable)
    .where(eq(postTable.userId, id))
    .orderBy(asc(postTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();
}

export async function getLatestPosts(page = 1, pageSize = 5) {
  try {
    const posts = await db
      .select({
        ...getTableColumns(postTable),
        tags: sql<
          Tag[]
        >`ARRAY(SELECT * FROM ${tagsToPostsTable} JOIN ${tagTable} ON ${tagsToPostsTable.tagId} = ${tagTable.id} WHERE ${tagsToPostsTable.postId} = ${postTable.id} )`,
      })
      .from(postTable)
      .where(
        between(postTable.createdAt, sql`now() - interval '1 day'`, sql`now()`),
      )
      .leftJoin(tagsToPostsTable, eq(postTable.id, tagsToPostsTable.postId))
      .orderBy(asc(postTable.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return { posts, error: null };
  } catch (error) {
    console.error(error);
    return { posts: null, error: "Failed to fetch posts" };
  }
}

export async function getPostsByTag(id: Tag["id"], page = 1, pageSize = 5) {
  const posts = await db
    .select({
      ...getTableColumns(postTable),
    })
    .from(postTable)
    .innerJoin(tagsToPostsTable, eq(tagsToPostsTable.postId, postTable.id))
    .where(eq(tagsToPostsTable.tagId, id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();

  return posts;
}

// export async function getTags1(
//   page = 1,
//   pageSize = 10,
// ): Promise<{ data: Tag[] | null; error: string | null }> {
//   try {
//     const tags = await db
//       .select()
//       .from(tagTable)
//       .orderBy(asc(tagTable.name))
//       .limit(pageSize)
//       .offset((page - 1) * pageSize)
//       .execute();

//     return { data: tags, error: null };
//   } catch (error) {
//     console.error(error);
//     return { data: null, error: "Something went wrong with getting all tags" };
//   }
// }

export async function getTags(
  page = 1,
  pageSize = 10,
): Promise<{ data: Tag[] | null; error: string | null }> {
  return handleDatabaseOperation(async () => {
    const tags = await db
      .select()
      .from(tagTable)
      .orderBy(asc(tagTable.name))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return tags;
  }, "Something went wrong with getting all tags");
}

// export async function getTags3() {
//   try {
//     const tags = await db.select().from(tagTable).execute();

//     return tags;
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function selectTag() {}

/**
 * export async function getPostWithId(id: Post["id"]) {
  try {
    const [post] = await db
      .select()
      .from(postTable)
      .where(eq(postTable.id, id));

    return { post, error: null };
  } catch (error) {
    console.error("Post could not be found", error);
    return { post: null, error: "Failed to find post" };
  }
}
 * */

/**
 *async function getPostsByTag(tagId, page = 1, pageSize = 5) {
  const posts = await db
    .select({
      id: postTable.id,
      title: postTable.title,
      content: postTable.content,
      featuredImage: postTable.featuredImage,
      slug: postTable.slug,
      createdAt: postTable.createdAt,
      updatedAt: postTable.updatedAt,
    })
    .from(postTable)
    .innerJoin(tagsToPostsTable, tagsToPostsTable.postId.equals(postTable.id))
    .where(tagsToPostsTable.tagId.equals(tagId))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  
  return posts;
}
 * */
