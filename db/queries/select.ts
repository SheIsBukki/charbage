"use server";

import { asc, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
  bookmarkTable,
  commentTable,
  likeTable,
  Post,
  postTable,
  profileTable,
  Tag,
  tagsToPostsTable,
  tagTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { handleDatabaseOperation } from "@/utils/helpers";

const reactionsAndTagsAgg = {
  commentsAgg: db
    .select({
      postId: commentTable.postId,
      commentCount: count(commentTable.id).as("comment_count"),
    })
    .from(commentTable)
    .groupBy(commentTable.postId)
    .as("comments_agg"),

  likesAgg: db
    .select({
      postId: likeTable.postId,
      likeCount: count(likeTable.id).as("like_count"),
    })
    .from(likeTable)
    .groupBy(likeTable.postId)
    .as("likes_agg"),

  bookmarksAgg: db
    .select({
      postId: bookmarkTable.postId,
      bookmarkCount: count(bookmarkTable.id).as("bookmark_count"),
    })
    .from(bookmarkTable)
    .groupBy(bookmarkTable.postId)
    .as("bookmarks_agg"),

  associatedTags: db
    .select({
      postId: tagsToPostsTable.postId,
      tags: sql`COALESCE(json_agg(json_build_object(
          'id', ${tagTable.id},
          'name', ${tagTable.name},
          'slug', ${tagTable.slug},
          'description', ${tagTable.description})) FILTER (WHERE ${tagTable.id} IS NOT NULL),'[]'::json)`.as(
        "tags",
      ),
    })
    .from(tagsToPostsTable)
    .leftJoin(tagTable, eq(tagTable.id, tagsToPostsTable.tagId))
    .groupBy(tagsToPostsTable.postId)
    .as("tags_posts_agg"),
};

export async function getLatestPosts(page = 1, pageSize = 5) {
  try {
    const { associatedTags, commentsAgg, likesAgg, bookmarksAgg } =
      reactionsAndTagsAgg;

    const posts = await db
      .select({
        ...getTableColumns(postTable),
        // I will replace this with authorSlug when all users have profile
        author: userTable.username,
        authorFirstname: profileTable.firstName,
        authorLastname: profileTable.lastName,
        authorAvatar: profileTable.avatar,
        tags: sql<Array<Tag>>`${associatedTags.tags}`,
        comments: sql<number>`COALESCE(${commentsAgg.commentCount}, 0)::int`,
        likes: sql<number>`COALESCE(${likesAgg.likeCount}, 0)::int`,
        bookmarks: sql<number>`COALESCE(${bookmarksAgg.bookmarkCount}, 0)::int`,
      })
      .from(postTable)
      // I WILL CHANGE THIS TO innerJoin when all users have a profile
      .leftJoin(profileTable, eq(profileTable.userId, postTable.userId))
      .innerJoin(userTable, eq(userTable.id, postTable.userId))
      .leftJoin(commentsAgg, eq(commentsAgg.postId, postTable.id))
      .leftJoin(likesAgg, eq(likesAgg.postId, postTable.id))
      .leftJoin(bookmarksAgg, eq(bookmarksAgg.postId, postTable.id))
      .leftJoin(associatedTags, eq(postTable.id, associatedTags.postId))
      .orderBy(
        desc(sql`COALESCE(${postTable.updatedAt}, ${postTable.createdAt})`),
      )
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
    const associatedTags = db
      .select({
        postId: tagsToPostsTable.postId,
        tags: sql`COALESCE(json_agg(json_build_object(
          'id', ${tagTable.id},
          'name', ${tagTable.name},
          'slug', ${tagTable.slug},
          'description', ${tagTable.description})) FILTER (WHERE ${tagTable.id} IS NOT NULL),'[]'::json)`.as(
          "tags",
        ),
      })
      .from(tagsToPostsTable)
      .leftJoin(tagTable, eq(tagTable.id, tagsToPostsTable.tagId))
      .groupBy(tagsToPostsTable.postId)
      .as("tags_posts_agg");

    const [post] = await db
      .select({
        ...getTableColumns(postTable),
        author: userTable.username,
        authorFirstname: profileTable.firstName,
        authorLastname: profileTable.lastName,
        authorAvatar: profileTable.avatar,
        tags: sql<Array<Tag>>`${associatedTags.tags}`,
      })
      .from(postTable)
      .innerJoin(userTable, eq(postTable.userId, userTable.id))
      .leftJoin(profileTable, eq(profileTable.userId, postTable.userId))
      .leftJoin(associatedTags, eq(postTable.id, associatedTags.postId))
      .where(eq(postTable.slug, slug))
      .execute();

    // console.log(post.tags);
    // console.log(post);
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

export async function getProfileWithSlug(slug: string) {
  // console.log(slug);
  try {
    const [profile] = await db
      .select()
      .from(profileTable)
      .where(eq(profileTable.slug, slug))
      .execute();
    // console.log(profile);
    return { profile: profile, error: null };
  } catch (error) {
    console.error("User could not be found", error);
    return { user: null, error: "Failed to find user" };
  }
}

// I might have to use the getPostsByUser instead to know the postCount of a user

export async function getPostsByUser(id: User["id"], page = 1, pageSize = 5) {
  try {
    const { associatedTags, commentsAgg, likesAgg, bookmarksAgg } =
      reactionsAndTagsAgg;

    const posts = await db
      .select({
        ...getTableColumns(postTable),
        tags: sql<Array<Tag>>`${associatedTags.tags}`,
        comments: sql<number>`COALESCE(${commentsAgg.commentCount}, 0)::int`,
        likes: sql<number>`COALESCE(${likesAgg.likeCount}, 0)::int`,
        bookmarks: sql<number>`COALESCE(${bookmarksAgg.bookmarkCount}, 0)::int`,
      })
      .from(postTable)
      .leftJoin(associatedTags, eq(postTable.id, associatedTags.postId))
      .leftJoin(commentsAgg, eq(commentsAgg.postId, postTable.id))
      .leftJoin(likesAgg, eq(likesAgg.postId, postTable.id))
      .leftJoin(bookmarksAgg, eq(bookmarksAgg.postId, postTable.id))
      .where(eq(postTable.userId, id))
      .orderBy(desc(postTable.updatedAt || postTable.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    // console.log(posts);
    return { posts, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Could not find posts by user", posts: null };
  }
}

export const usernameAlreadyExists = async (username: string) => {
  try {
    const [existingUsername] = await db
      .select({ username: userTable.username })
      .from(userTable)
      .where(eq(userTable.username, username.toLowerCase()));

    console.log(existingUsername?.username);
    return { result: !!existingUsername, error: null };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong. Could not verify",
      result: null,
    };
  }
};

export const emailAlreadyExists = async (email: string) => {
  try {
    const [existingEmail] = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(eq(userTable.email, email.toLowerCase()));

    return { result: !!existingEmail, error: null };
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong. Could not verify",
      result: null,
    };
  }
};

export const getUserBookmarks = async (
  currentUserId: string,
  page = 1,
  pageSize = 5,
) => {
  if (!currentUserId) {
    return { error: "Failed to fetch user bookmarks", result: null };
  }

  try {
    const bookmarks = await db
      .select({
        bookmarkId: bookmarkTable.id,
        totalBookmarks: sql<number>`COUNT(*) OVER (PARTITION BY ${bookmarkTable.userId}) AS bookmark_count`,
        title: postTable.title,
        postSlug: postTable.slug,
        createdAt: postTable.createdAt,
        updatedAt: postTable.updatedAt,
        authorSlug: profileTable.slug,
        authorFirstname: profileTable.firstName,
        authorLastname: profileTable.lastName,
        authorAvatar: profileTable.avatar,
        authorUsername: userTable.username,
      })
      .from(bookmarkTable)
      .innerJoin(postTable, eq(bookmarkTable.postId, postTable.id))
      .leftJoin(profileTable, eq(profileTable.userId, postTable.userId))
      .leftJoin(userTable, eq(userTable.id, postTable.userId))
      .where(eq(bookmarkTable.userId, currentUserId))
      .orderBy(desc(bookmarkTable.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return { result: bookmarks, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch user bookmarks", result: null };
  }
};

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
    // const searchedTag = await db // For multiple search results
    const [searchedTag] = await db
      .select()
      .from(tagTable)
      // .where(keyword ? ilike(tagTable.name, keyword) : undefined);
      .where(ilike(tagTable.name, `%${keyword}%`));
    // console.log(searchedTag);
    // console.log(searchedTag.name);
    return searchedTag;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong with searching for tag");
  }
};

export const getTagWithSlug = async (slug: string) => {
  try {
    const [tag] = await db
      .select()
      .from(tagTable)
      .where(eq(tagTable.slug, slug));

    return { result: tag, error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to find tag", result: null };
  }
};

// export const getTagById = async (id: string) => {
//   try {
//     const [tag] = await db.select().from(tagTable).where(eq(tagTable.id, id));
//
//     return { result: tag, error: null };
//   } catch (error) {
//     console.error(error);
//     return { error: "Failed to find tag", result: null };
//   }
// };

// export async function getUserWithId(id: User["id"]) {
//   try {
//     const { githubUserId, googleUserId, password, ...rest } =
//       getTableColumns(userTable);
//
//     const [user] = await db
//       .select({ ...rest, postsCount: count(postTable.id) })
//       .from(userTable)
//       .where(eq(userTable.id, id))
//       .leftJoin(postTable, eq(userTable.id, postTable.userId))
//       .groupBy(userTable.id)
//       .execute();
//
//     return { user, error: null };
//   } catch (error) {
//     console.error("User could not be found", error);
//     return { user: null, error: "Failed to find user" };
//   }
// }

// export async function getPostsByTag(id: Tag["id"], page = 1, pageSize = 5) {
//   const posts = await db
//     .select({
//       ...getTableColumns(postTable),
//     })
//     .from(postTable)
//     .innerJoin(tagsToPostsTable, eq(tagsToPostsTable.postId, postTable.id))
//     .where(eq(tagsToPostsTable.tagId, id))
//     .limit(pageSize)
//     .offset((page - 1) * pageSize)
//     .execute();
//
//   return posts;
// }

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

// sql<number>`COUNT(*) OVER (PARTITION BY ${bookmarkTable.userId}) AS bookmark_count`

/*
const commentsAgg = db
      .select({
        postId: commentTable.postId,
        commentCount: count(commentTable.id).as("comment_count"),
      })
      .from(commentTable)
      .groupBy(commentTable.postId)
      .as("comments_agg");

    const likesAgg = db
      .select({
        postId: likeTable.postId,
        likeCount: count(likeTable.id).as("like_count"),
      })
      .from(likeTable)
      .groupBy(likeTable.postId)
      .as("likes_agg");

    const bookmarksAgg = db
      .select({
        postId: bookmarkTable.postId,
        bookmarkCount: count(bookmarkTable.id).as("bookmark_count"),
      })
      .from(bookmarkTable)
      .groupBy(bookmarkTable.postId)
      .as("bookmarks_agg");

    const associatedTags = db
      .select({
        postId: tagsToPostsTable.postId,
        tags: sql`COALESCE(json_agg(json_build_object(
          'id', ${tagTable.id},
          'name', ${tagTable.name},
          'slug', ${tagTable.slug},
          'description', ${tagTable.description})) FILTER (WHERE ${tagTable.id} IS NOT NULL),'[]'::json)`.as(
          "tags",
        ),
      })
      .from(tagsToPostsTable)
      .leftJoin(tagTable, eq(tagTable.id, tagsToPostsTable.tagId))
      .groupBy(tagsToPostsTable.postId)
      .as("tags_posts_agg");

* */
