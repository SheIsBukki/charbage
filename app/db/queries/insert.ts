"use server";

import { db } from "@/app/db";
import { postTable } from "@/app/db/schema";
import { getCurrentSession } from "@/app/lib/session";
import slugify from "slugify";

export async function createPost(data: {
  title: string;
  content: string;
  featuredImage?: string | undefined;
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
        slug: slugify(data.title.toLowerCase()),
        featuredImage: data.featuredImage,
      })
      .returning()
      .execute();
    // revalidatePath("posts");
    // redirect(`/post/$(id)`);

    return { ...post, error: null };
  } catch (error) {
    console.error("Error creating article:", error);
    return { post: null, error: "Failed to create post" };
  }
}

/**
 * Bring in the user to collect and connect the userId
 * Create a slug of the title using Slugify
 *
 * */
