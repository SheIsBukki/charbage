// import TagSelection from "@/components/tag/TagSelection";
import { getCurrentSession } from "@/lib/session";
import MainNav from "@/app/ui/MainNav";
import ArticleCard from "@/components/articles/ArticleCard";
import { getLatestPosts } from "@/db/queries/select";
import { polyfill } from "interweave-ssr";

polyfill();

export default async function Home() {
  const { user } = await getCurrentSession();
  const articlesData = await getLatestPosts();
  // const { posts } = articlesData;
  return (
    <>
      <MainNav user={user} />
      <main className="container mx-auto grid-cols-8 gap-12 lg:grid">
        {/*Other stuff like Reading List, User Suggestion, etc*/}
        <div className="col-span-3 hidden lg:block"></div>

        {/*Article*/}
        <div className="col-span-5">
          <ArticleCard articlesData={articlesData} />
        </div>
      </main>
    </>
  );
}
