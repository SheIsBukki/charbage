// import TagSelection from "@/components/tag/TagSelection";
import { getCurrentSession } from "@/lib/session";
import MainNav from "@/app/ui/MainNav";
import ArticleCard from "@/components/articles/ArticleCard";
import { getLatestPosts } from "@/db/queries/select";
import { polyfill } from "interweave-ssr";

polyfill();

// export type ArticlesProps =
//   | {
//       posts: {
//         author: string;
//         id: string;
//         title: string;
//         content: string;
//         featuredImage: string | null;
//         slug: string;
//         createdAt: Date;
//         updatedAt: Date;
//         userId: string;
//       }[];
//       error: null;
//     }
//   | {};
//
// export type PostsProps = {
//   author: string;
//   id: string;
//   title: string;
//   content: string;
//   featuredImage: string | null;
//   slug: string;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;
// }[];

export default async function Home() {
  const { user } = await getCurrentSession();
  const latestArticles = await getLatestPosts();
  // const { posts } = latestArticles;
  return (
    <>
      <MainNav user={user} />
      <main className="container mx-auto grid-cols-8 gap-12 lg:grid">
        {/*Other stuff like Reading List, User Suggestion, etc*/}
        <div className="col-span-3 hidden lg:block"></div>

        {/*Article*/}
        <div className="col-span-5">
          <ArticleCard latestArticles={latestArticles} />
        </div>
      </main>
    </>
  );
}
