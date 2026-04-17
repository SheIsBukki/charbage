"use server";

import { db } from "@/db";
import {
  bookmarkTable,
  Comment,
  commentTable,
  likeTable,
  Post,
  postTable,
  TagsToPosts,
  tagsToPostsTable,
  tagTable,
} from "@/db/schema";
import { getCurrentSession } from "@/lib/session";
import { handleDatabaseOperation } from "@/utils/helpers";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

/**This can generate up to over 2 billion random values, each 6 characters long with a mix of letters and numbers */
const byte = crypto.getRandomValues(new Uint8Array(6));
const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
let randomString = "";
for (let i = 0; i < byte.length; i++) {
  randomString += characters[byte[i] % characters.length];
}

export async function createPost(data: {
  title: string;
  description: string;
  content: string;
  featuredImage?: string | undefined;
}): Promise<{ data: Post | null; error: string | null }> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      data: null,
      error: "User must be logged in to create a post",
    };
  }

  return handleDatabaseOperation(async () => {
    const [post] = await db
      .insert(postTable)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description,
        content: data.content,
        slug: encodeURIComponent(
          `${slugify(data.title.toLowerCase())}-${randomString}`,
        ),
        featuredImage: data.featuredImage,
        updatedAt: null,
      })
      .returning()
      .execute();

    // revalidatePath("/write");

    return post;
  }, "Failed to create post");
}

export async function addLike(postId: string, userId: string) {
  if (!userId) {
    return { error: "User must be logged in to like a post", result: null };
  }

  try {
    const [userAlreadyLiked] = await db
      .select()
      .from(likeTable)
      .where(and(eq(likeTable.postId, postId), eq(likeTable.userId, userId)));

    if (userAlreadyLiked) {
      return { error: "User already liked this post", result: null };
    }

    await db.insert(likeTable).values({ postId, userId }).returning().execute();

    revalidatePath("/blog");
    return { result: "Successfully liked post", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to like post", result: null };
  }
}

export async function addBookmark(postId: string, userId: string) {
  if (!userId) {
    return {
      error: "User must be logged in to bookmark a post",
      result: null,
    };
  }
  try {
    const [userAlreadyBookmarked] = await db
      .select()
      .from(bookmarkTable)
      .where(
        and(eq(bookmarkTable.userId, userId), eq(bookmarkTable.postId, postId)),
      );

    if (userAlreadyBookmarked) {
      return {
        error: "User already bookmarked this post",
        result: null,
      };
    }

    await db
      .insert(bookmarkTable)
      .values({ postId, userId })
      .returning()
      .execute();

    revalidatePath("/blog");
    return { result: "Successfully bookmarked post", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to bookmark post", result: null };
  }
}

export async function createTag(name: string, description: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    return { error: "User must be logged in to create a tag" };
  }

  const upperCaseTagName: string = name.toUpperCase();

  const [verifyTag] = await db
    .select({ tagName: tagTable.name })
    .from(tagTable)
    .where(eq(tagTable.name, upperCaseTagName))
    .execute();

  if (verifyTag) {
    return { error: "Sorry, tag already exists" };
  }

  try {
    const [tag] = await db
      .insert(tagTable)
      .values({
        name: upperCaseTagName,
        description,
        slug: `${slugify(upperCaseTagName)}-${randomString}`,
        userId: user.id,
      })
      .returning()
      .execute();

    return { tag };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create tag" };
  }
}

export async function addTag(
  postId: string,
  tagId: string,
): Promise<{ data: TagsToPosts | null; error: string | null }> {
  // const { user } = await getCurrentSession();
  // if (!user) {
  //   return { data: null, error: "You must be logged in to add tag to post" };
  // }

  return handleDatabaseOperation(async () => {
    const [tag] = await db
      .insert(tagsToPostsTable)
      .values({ postId: postId, tagId: tagId })
      .returning()
      .execute();

    return tag;
  }, "Failed to add tag to post");
}

export async function createComment(
  content: string,
  postId: string,
  userId: string,
): Promise<{ data: Comment | null; error: string | null }> {
  if (!userId) {
    return {
      data: null,
      error: "User must be logged in to create a comment",
    };
  }

  return handleDatabaseOperation(async () => {
    const [comment] = await db
      .insert(commentTable)
      .values({ content, userId, postId, updatedAt: null }) // TO DO — decide how to collect postId
      .returning()
      .execute();

    return comment;
  }, "Failed to create comment");
}
