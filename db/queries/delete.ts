"use server";

import { and, count, eq, getTableColumns } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  bookmarkTable,
  Comment,
  commentTable,
  likeTable,
  Post,
  postTable,
  Tag,
  TagsToPosts,
  tagsToPostsTable,
  tagTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { getCurrentSession } from "@/lib/session";

export async function deletePost(id: Post["id"]) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      error: "You are not authorised to delete this post",
      result: null,
    };
  }

  try {
    await db
      .delete(postTable)
      .where(and(eq(postTable.id, id), eq(postTable.userId, user.id)));

    return { result: "Post deleted successfully.", error: null };
  } catch (err) {
    console.log(err);
    return {
      error: "Failed to delete post",
      result: null,
    };
  }
}

export async function removeLike(postId: Post["id"], userId: User["id"]) {
  if (!userId) {
    return {
      error: "User must be logged in to remove a like on a post",
      result: null,
    };
  }

  try {
    const [likeExist] = await db
      .select()
      .from(likeTable)
      .where(and(eq(likeTable.userId, userId), eq(likeTable.postId, postId)))
      .execute();

    if (!likeExist) {
      return {
        error: "Can't delete your like because you never liked the post",
        result: null,
      };
    }

    await db.delete(likeTable).where(eq(likeTable.id, likeExist.id));
    revalidatePath("/blog");
    return { result: "Successfully removed like", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove like", result: null };
  }
}

export async function removeBookmark(postId: Post["id"], userId: User["id"]) {
  if (!userId) {
    return {
      error: "User must be logged in to remove a like on a post",
      result: null,
    };
  }

  try {
    const [bookmarkExist] = await db
      .select()
      .from(bookmarkTable)
      .where(
        and(eq(bookmarkTable.userId, userId), eq(bookmarkTable.postId, postId)),
      )
      .execute();

    // console.log(bookmarkExist);

    if (!bookmarkExist) {
      return {
        error:
          "Can't delete your bookmark because you never bookmarked the post",
        result: null,
      };
    }

    await db
      .delete(bookmarkTable)
      .where(eq(bookmarkTable.id, bookmarkExist.id));
    revalidatePath("/blog");
    return { result: "Successfully removed bookmark", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove bookmark", result: null };
  }
}

export async function deleteComment(id: Comment["id"]) {
  try {
    await db.delete(commentTable).where(eq(commentTable.id, id));
    return { result: "Comment deleted successfully.", error: null };
  } catch (err) {
    console.log(err);
    return {
      error: "Failed to delete comment",
      result: null,
    };
  }
}

export async function deleteUser(id: User["id"]) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      result: null,
      error: "You are not authorised to delete another user",
    };
  }

  try {
    await db.delete(userTable).where(eq(userTable.id, id));
    revalidatePath("/");

    return { result: "User successfully removed", error: null };
  } catch (err) {
    console.error(err);
    return { result: null, error: "Failed to delete user" };
  }
}

// This is only going to remove the relationship between a tag and a post, not actually delete the tag. Tags can only be deleted by tag author if the tag is not associated with any post
export async function removeTag(
  tagId: TagsToPosts["tagId"],
  postId: TagsToPosts["postId"],
) {
  try {
    const [removeTagAssociation] = await db
      .delete(tagsToPostsTable)
      .where(
        and(
          eq(tagsToPostsTable.tagId, tagId),
          eq(tagsToPostsTable.postId, postId),
        ),
      )
      .returning()
      .execute();

    return { result: removeTagAssociation, error: null };
  } catch (err) {
    console.error(err);
    return { result: null, error: "Failed to delete tag" };
  }
}

export async function deleteTag(id: Tag["id"]) {
  const { user } = await getCurrentSession();

  if (!user) {
    return { error: "User must be logged in to delete tag" };
  }

  const [tagToDelete] = await db
    .select({
      ...getTableColumns(tagTable),
      postsCount: count(tagsToPostsTable.postId),
    })
    .from(tagTable)
    .where(eq(tagTable.id, id))
    .leftJoin(tagsToPostsTable, eq(tagsToPostsTable.tagId, tagTable.id))
    .execute();

  if (tagToDelete.userId !== user.id) {
    return { error: "Only tag author can delete tag" };
  }

  if (tagToDelete.postsCount >= 1) {
    return {
      error: "Can't delete: tag is associated with at least one post",
    };
  }

  const [deletedTag] = await db
    .delete(tagTable)
    .where(eq(tagTable.id, id))
    .returning()
    .execute();

  return deletedTag;
}

export async function deleteTag2(id: Tag["id"]) {
  const { user } = await getCurrentSession();

  if (!user) {
    return { error: "User must be logged in to delete tag" };
  }

  const [tagToDelete] = await db
    .select({
      ...getTableColumns(tagTable),
      postsCount: count(tagsToPostsTable.postId),
    })
    .from(tagTable)
    .where(eq(tagTable.id, id))
    .leftJoin(tagsToPostsTable, eq(tagsToPostsTable.tagId, tagTable.id));

  if (tagToDelete.userId === user.id) {
    if (tagToDelete.postsCount >= 1) {
      return {
        error: "Can't delete: tag is associated with at least one post",
      };
    }

    const [deletedTag] = await db
      .delete(tagTable)
      .where(eq(tagTable.id, id))
      .returning()
      .execute();

    return deletedTag;
  } else {
    return { error: "Only tag author can delete tag" };
  }
}
