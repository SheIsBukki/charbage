"use server";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
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
      })
      .returning()
      .execute();

    revalidatePath("/write");
    // redirect("/write");

    return { ...post, error: null };
  } catch (error) {
    console.error("Error creating article:", error);
    return { post: null, error: "Failed to create post" };
  }
}

/** TO DO
 * createTag()
 * createComment()
 * createBookmark()
 * createLike()
 * */
