import { polyfill } from "interweave-ssr";
// import TagSelection from "@/components/tag/TagSelection";
import { getCurrentSession } from "@/lib/session";
import { getLatestPosts, getUserBookmarks } from "@/db/queries/select";
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

  // console.log(posts?.length);
  // console.log(postArr.length);

  // console.log(currentUserBookmarks);

  return (
    <div className="h-full">
      <HomePageClient
        posts={postArr}
        currentUserBookmarks={bookmarkArr}
        currentUserId={user?.id}
      />
    </div>
  );
}
