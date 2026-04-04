"use server";

import {
  commentTable,
  Post,
  postTable,
  Profile,
  profileTable,
  User,
  userTable,
} from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { UserAccountFormValues, ProfileFormValues } from "@/lib/types";

export async function updatePost(
  id: Post["id"],
  data: {
    title: string;
    description: string;
    content: string;
    featuredImage?: string;
    slug?: string;
  },
) {
  try {
    const [post] = await db
      .update(postTable)
      .set({
        title: data.title,
        description: data.description,
        content: data.content,
        featuredImage: data.featuredImage,
        slug: data.slug,
      })
      .where(eq(postTable.id, id))
      .returning();

    return post;
  } catch (err) {
    console.error(err);
    return "Failed to update post";
  }
}

export async function deleteFeaturedImage(
  imageUrl: string,
  userId: User["id"],
) {
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      error: "You are not authorised to delete this image",
      result: null,
    };
  }

  const [imageUrlExist] = await db
    .select({ featuredImage: postTable.featuredImage })
    .from(postTable)
    .where(
      and(eq(postTable.userId, userId), eq(postTable.featuredImage, imageUrl)),
    );

  if (!imageUrlExist) {
    return { error: "Image doesn't exist in the database", result: null };
  }

  try {
    await db
      .update(postTable)
      .set({ featuredImage: "" })
      .where(
        and(
          eq(postTable.featuredImage, imageUrl),
          eq(postTable.userId, userId),
        ),
      );

    return { result: "Featured image deleted successfully.", error: null };
  } catch (err) {
    console.log(err);
    return {
      error: "Failed to delete featured image due to server/database error",
      result: null,
    };
  }
}

export async function updateComment(commentId: string, content: string) {
  try {
    const [comment] = await db
      .update(commentTable)
      .set({ content: content })
      .where(eq(commentTable.id, commentId))
      .returning();

    // console.log("comment", comment);

    return { result: "Comment updated successfully", error: null };
  } catch (error) {
    console.error(error);
    return { result: null, error: "Failed to update comment" };
  }
}

export async function updateProfile(
  profileId: Profile["id"],
  values: ProfileFormValues,
) {
  const socialLinks = { github: values.github, linkedin: values.linkedin };
  try {
    const [profile] = await db
      .update(profileTable)
      .set({
        avatar: values.avatar,
        bio: values.bio,
        lastName: values.lastname,
        firstName: values.firstname,
        about: values.about,
        socialLinks: JSON.stringify(socialLinks),
      })
      .where(eq(profileTable.id, profileId))
      .returning();

    return { result: "Profile updated successfully", error: null };
  } catch (error) {
    console.error(error);
    return { result: null, error: "Failed to update profile" };
  }
}

export async function removeAvatar(profileId: Profile["id"]) {
  try {
    await db
      .update(profileTable)
      .set({ avatar: "" })
      .where(eq(profileTable.id, profileId));

    return { result: "Avatar deleted successfully.", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete avatar", result: null };
  }
}

export async function updateUserAccount(
  userId: User["id"],
  { username, email }: UserAccountFormValues,
) {
  try {
    await db
      .update(profileTable)
      .set({ slug: `@${username}` })
      .where(eq(profileTable.userId, userId));

    await db
      .update(userTable)
      .set({
        username: username,
        email: email,
      })
      .where(eq(userTable.id, userId))
      .returning();

    return { result: "Account updated successfully", error: null };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update account", result: null };
  }
}
