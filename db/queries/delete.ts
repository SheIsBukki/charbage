import {
  Comment,
  commentTable,
  Post,
  postTable,
  Tag,
  tagsToPostsTable,
  tagTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { count, eq, getTableColumns } from "drizzle-orm";
import { getCurrentSession } from "@/lib/session";

export async function deletePost(id: Post["id"]) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      user: null,
      error: "You are not authorised to delete this post",
    };
  }

  await db.delete(postTable).where(eq(postTable.id, id));
}

export async function deleteComment(id: Comment["id"]) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      user: null,
      error: "You are not authorised to delete this comment",
    };
  }

  await db.delete(commentTable).where(eq(commentTable.id, id));
}

// This is only going to remove the relationship between a tag and a post, not actually delete the tag. Tags can only be deleted by tag author if the tag is not associated with any post
export async function removeTag(id: Tag["id"]) {
  const { user } = await getCurrentSession();

  if (!user) {
    return {
      error: "User must be logged in to delete tag",
    };
  }

  const [tagToRemove] = await db
    .select({ ...getTableColumns(tagTable), postAuthor: postTable.userId })
    .from(tagsToPostsTable)
    .where(eq(tagsToPostsTable.tagId, id))
    .innerJoin(postTable, eq(tagsToPostsTable.postId, postTable.id))
    .execute();

  if (tagToRemove.postAuthor !== user.id) {
    return {
      error: "Only the post author is authorised to remove tags on a post",
    };
  }

  const [removeTagAssociation] = await db
    .delete(tagsToPostsTable)
    .where(eq(tagsToPostsTable.tagId, id))
    .returning()
    .execute();

  return removeTagAssociation;
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

export async function deleteUser(id: User["id"]) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      user: null,
      error: "You are not authorised to delete another user",
    };
  }

  await db.delete(userTable).where(eq(userTable.id, id));
}
