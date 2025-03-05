import { Post, postTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function updatePost(
  id: Post["id"],
  data: Partial<Omit<Post, "id">>,
) {
  await db.update(postTable).set(data).where(eq(postTable.id, id));
}
