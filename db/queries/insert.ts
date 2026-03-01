"use server";

import { db } from "@/db";
import {
  Comment,
  commentTable,
  Post,
  postTable,
  TagsToPosts,
  tagsToPostsTable,
  tagTable,
} from "@/db/schema";
import { getCurrentSession } from "@/lib/session";
import { handleDatabaseOperation } from "@/utils/helpers";

import { eq } from "drizzle-orm";
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
        content: data.content,
        slug: `${slugify(data.title.toLowerCase())}-${randomString}`,
        featuredImage: data.featuredImage,
        updatedAt: null,
      })
      .returning()
      .execute();

    revalidatePath("/write");

    return post;
  }, "Failed to create post");
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
  const { user } = await getCurrentSession();
  if (!user) {
    return { data: null, error: "You must be logged in to add tag to post" };
  }

  return handleDatabaseOperation(async () => {
    const [tag] = await db
      .insert(tagsToPostsTable)
      .values({ postId, tagId })
      .returning()
      .execute();

    return tag;
  }, "Failed to add tag to post");
}

export async function createComment(
  content: string,
  postId: string,
): Promise<{ data: Comment | null; error: string | null }> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      data: null,
      error: "User must be logged in to create a comment",
    };
  }

  return handleDatabaseOperation(async () => {
    const [comment] = await db
      .insert(commentTable)
      .values({ content, userId: user.id, postId }) // TO DO — decide how to collect postId
      .returning()
      .execute();

    return comment;
  }, "Failed to create comment");
}

/** TO DO
 * createTag()
 *
 * addTag() — will accept two parameters: postId and tagId
 *
 * createComment()
 * For comments, we need the userId, the postId, and the comment string. For the comment form, The only thing the user will create is the comment string
 *
 * createBookmark()
 * createLike()
 **/

/**
 * export async function createPost(data: {
  title: string;
  content: string;
  featuredImage?: string | undefined;
  // comments: string[];
}) {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      user: null,
      error: "User must be logged in to create a post",
    };
  }

  try {
    const [post] = await db
      .insert(postTable)
      .values({
        userId: user.id,
        title: data.title,
        content: data.content,
        slug: `${slugify(data.title.toLowerCase())}-${randomString}`,
        featuredImage: data.featuredImage,
        // comments: [],
      })
      .returning()
      .execute();

    revalidatePath("/write");

    return { post, error: null };
  } catch (error) {
    console.error("Error creating article:", error);
    return { post: null, error: "Failed to create post" };
  }
}
 **/

/**
 * export async function createComment(content: string, postId: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      user: null,
      error: "User must be logged in to create a comment",
    };
  }

  try {
    const [comment] = await db
      .insert(commentTable)
      .values({ content, userId: user.id, postId }) // TO DO — decide how to collect postId
      .returning()
      .execute();

    return { comment, error: null };
  } catch (error) {
    console.error(error);
    return { comment: null, error: "Failed to create comment" };
  }
}
 * */

/**
 * export async function createTag(name: string, description: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      // tag: null,
      error: "User must be logged in to create a tag",
    };
  }

  try {
    const [tag] = await db
      .insert(tagTable)
      .values({
        name,
        description,
        slug: `${slugify(name.toLowerCase())}-${randomString}`,
      })
      .returning()
      .execute();

    return { tag, error: null };
  } catch (error) {
    console.error(error);
    return { tag: null, error: "Failed to create tag" };
  }
}
 * */

/**
 * export async function createTag(
  name: string,
  description: string,
): Promise<{ data: Tag | null; error: string | null }> {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      data: null,
      error: "User must be logged in to create a tag",
    };
  }

  const [verifyTag] = await db
    .select()
    .from(tagTable)
    .where(eq(tagTable.name, name))
    .execute();

  if (verifyTag.name === name) {
    return { data: null, error: "Sorry, tag already exists" };
  }

  return handleDatabaseOperation(async () => {
    const [tag] = await db
      .insert(tagTable)
      .values({
        name: `${name.toUpperCase()}`,
        description,
        slug: `${slugify(name.toLowerCase())}-${randomString}`,
        userId: user.id,
      })
      .returning()
      .execute();

    return tag;
  }, "Failed to create tag");
}
 * */
