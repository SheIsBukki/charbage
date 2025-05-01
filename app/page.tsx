// import TagSelection from "@/components/tag/TagSelection";
import { getCurrentSession } from "@/lib/session";
import MainNav from "@/app/ui/MainNav";
import ArticleCard from "@/components/articles/ArticleCard";

export default async function Home() {
  const { user } = await getCurrentSession();
  return (
    <>
      <MainNav user={user} />
      <main className="container mx-auto grid-cols-8 gap-12 lg:grid">
        {/*Other stuff like Reading List, User Suggestion, etc*/}
        <div className="col-span-3 hidden lg:block"></div>

        {/*Article*/}
        <div className="col-span-5">
          <ArticleCard />
        </div>
      </main>
    </>
  );
}
