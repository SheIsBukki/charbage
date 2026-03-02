"use server";

import { Post, postTable, User } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updatePost(
  id: Post["id"],
  data: Partial<Omit<Post, "id">>,
) {
  await db.update(postTable).set(data).where(eq(postTable.id, id));
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
      .set({ featuredImage: null })
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
