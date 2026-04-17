import { polyfill } from "interweave-ssr";
import { getCurrentSession } from "@/lib/session";
import { getLatestPosts, getTags, getUserBookmarks } from "@/db/queries/select";
import HomePageClient from "@/app/HomePageClient";

polyfill();

export default async function Home() {
  const { user } = await getCurrentSession();
  const { posts } = await getLatestPosts();

  const { result: currentUserBookmarks } = await getUserBookmarks(
    user?.id || "",
  );

  const postArr = [];
  if (posts) {
    postArr.push(...posts);
  }
  const bookmarkArr = [];
  if (currentUserBookmarks) {
    bookmarkArr.push(...currentUserBookmarks);
  }

  const tags = await getTags();

  if (!tags.data) {
    throw new Error("Something went wrong with getting all tags");
  }

  return (
    <div className="h-full">
      <HomePageClient
        posts={postArr}
        currentUserBookmarks={bookmarkArr}
        currentUserId={user?.id}
        tags={tags.data}
      />
    </div>
  );
}
