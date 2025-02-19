"use server";

import { db } from "@/db";
import { postTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/session";
// import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import slugify from "slugify";

const byte = crypto.getRandomValues(new Uint8Array(6));
const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
let randomString = "";
for (let i = 0; i < byte.length; i++) {
  randomString += characters[byte[i] % characters.length];
}

/**This will generate over 16 million random values, each 5 characters long with a mix of letters and numbers. If i increase the Unit8Array value to 4, the random values will increase to over 4 billion */
// const byte = new Uint8Array(4);
// crypto.getRandomValues(byte);
// const randomString = encodeBase32LowerCaseNoPadding(byte);

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
