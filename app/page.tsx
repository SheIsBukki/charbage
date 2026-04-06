// import TagSelection from "@/components/tag/TagSelection";
// import { getCurrentSession } from "@/lib/session";
// import MainNav from "@/app/ui/MainNav";
import ArticleCard from "@/components/articles/ArticleCard";
import { getLatestPosts } from "@/db/queries/select";
import { polyfill } from "interweave-ssr";

polyfill();

export default async function Home() {
  // const { user } = await getCurrentSession();
  const { posts } = await getLatestPosts();

  return (
    <>
      <div className="py4 borer container mx-auto grid-cols-8 gap-12 border-red-500 lg:grid">
        {/*Other stuff like Reading List, User Suggestion, etc*/}
        <div className="col-span-3 hidden lg:block"></div>

        {/*Article Cards*/}
        <div className="col-span-5">
          {posts &&
            posts.map((post) => <ArticleCard key={post.id} article={post} />)}
        </div>
      </div>
    </>
  );
}
