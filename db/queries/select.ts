"use server";

import {
  bookmarkTable,
  commentTable,
  likeTable,
  Post,
  postTable,
  Tag,
  tagsToPostsTable,
  tagTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  sql,
} from "drizzle-orm";
import { handleDatabaseOperation } from "@/utils/helpers";
import { getCurrentSession } from "@/lib/session";

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

export async function getUserWithUsername(username: string) {
  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
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
        // postId: postTable.id,
        ...getTableColumns(postTable),
        author: userTable.username,
        // comments: count(commentTable.id),
        // likes: count(likeTable.id),
        // bookmarks: count(bookmarkTable.id),

        // tags: sql<
        //   tag[]
        // >`array(select * from ${tagstopoststable} join ${tagtable} on ${tagstopoststable.tagid} = ${tagtable.id} where ${tagstopoststable.postid} = ${posttable.id} )`,
      })
      .from(postTable)
      // .groupBy(postTable.id)
      // I don't need the where statement for now, and will probably never need it since the orderBy desc statement does the job
      // .where(
      //   between(postTable.createdAt, sql`now() - interval '1 day'`, sql`now()`),
      // )
      .leftJoin(tagsToPostsTable, eq(postTable.id, tagsToPostsTable.postId))
      .innerJoin(userTable, eq(postTable.userId, userTable.id))
      // .leftJoin(commentTable, eq(commentTable.postId, postTable.id))
      // .leftJoin(likeTable, eq(likeTable.id, commentTable.postId))
      // .leftJoin(bookmarkTable, eq(bookmarkTable.postId, postTable.id))
      .orderBy(desc(postTable.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return {
      posts,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      posts: null,
      error: "Failed to fetch posts",
    };
  }
}

export async function getPostWithSlug(slug: Post["slug"]) {
  try {
    const [post] = await db
      .select({
        ...getTableColumns(postTable),
        author: userTable.username,
      })
      .from(postTable)
      .innerJoin(userTable, eq(postTable.userId, userTable.id))
      .where(eq(postTable.slug, slug))
      .execute();

    return { post, error: null };
  } catch (error) {
    console.error("Post could not be found", error);
    return { post: null, error: "Failed to find post" };
  }
}

export async function getPostReactionsWithId(postId: Post["id"]) {
  try {
    const likes = await db
      .select()
      .from(likeTable)
      .where(eq(likeTable.postId, postId))
      .orderBy(desc(likeTable.createdAt))
      .execute();

    const comments = await db
      .select({ ...getTableColumns(commentTable), author: userTable.username })
      .from(commentTable)
      .innerJoin(userTable, eq(commentTable.userId, userTable.id))
      .where(eq(commentTable.postId, postId))
      .orderBy(desc(commentTable.createdAt))
      .execute();

    const bookmarks = await db
      .select()
      .from(bookmarkTable)
      .where(eq(bookmarkTable.postId, postId))
      .orderBy(desc(bookmarkTable.createdAt))
      .execute();

    return {
      reactions: {
        likes: likes,
        comments: comments,
        bookmarks: bookmarks,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return { reactions: null, error: "Failed to fetch post reactions" };
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

// Tag Search Functionality
export const searchTags = async (keyword: string) => {
  try {
    const searchedTag = await db
      .select()
      .from(tagTable)
      .where(keyword ? ilike(tagTable.name, keyword) : undefined);

    return searchedTag;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong with searching for tag");
  }
};

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

/*
export async function findLike(postId: Post["id"]) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        error: "User must be logged in to remove a like on a post",
        result: null,
      };
    }

    const userId = user.id;

    const [likeExist] = await db
      .select()
      .from(likeTable)
      .where(and(eq(likeTable.userId, userId), eq(likeTable.postId, postId)))
      .execute();

    console.log(likeExist);

    return { result: "Successfully found like", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to find like", result: null };
  }
}
* */

/*
export async function getPostLikes(postId: Post["id"]) {
  try {
    const likes = await db
      .select()
      .from(likeTable)
      .where(eq(likeTable.postId, postId))
      .orderBy(desc(likeTable.createdAt))
      .execute();

    return { likes: likes, error: null };
  } catch (error) {
    console.error(error);
    return { likes: null, error: "Failed to fetch post likes" };
  }
}
* */

/*
export async function getPostReactionCountWithId(id: Post["id"]) {
  try {
    const [reactionCount] = await db
      .select({
        comments: count(commentTable),
        likes: count(likeTable),
        bookmarks: count(bookmarkTable),
      })
      .from(postTable)
      .leftJoin(commentTable, eq(commentTable.postId, postTable.id))
      .leftJoin(likeTable, eq(likeTable.postId, postTable.id))
      .leftJoin(bookmarkTable, eq(bookmarkTable.postId, postTable.id))
      .where(eq(postTable.id, id))
      .execute();

    return { reactionCount, error: null };
  } catch (error) {
    console.error(error);
    return { reactionCount: null, error: "Failed to fetch reaction count" };
  }
}
* */
