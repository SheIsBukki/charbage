import { getCurrentSession } from "@/lib/session";
import { getPostsByUser, getProfileWithSlug } from "@/db/queries/select";
import { notFound } from "next/navigation";
import BioCard from "@/components/profile/BioCard";
import ArticleCard from "@/components/articles/ArticleCard";
import AboutCard from "@/components/profile/AboutCard";
import { MdOutlineArticle } from "react-icons/md";
import { IoArrowDown } from "react-icons/io5";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profileSlug = decodeURIComponent(slug);
  const { profile } = await getProfileWithSlug(profileSlug);

  if (!profile) {
    return {
      title: "User Not Found",
    };
  }

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  return {
    title: fullName || profileSlug,
    description: profile.bio || `${fullName || profileSlug}'s profile page`, // Until user's short bio hence user?.bio
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user: currentUser } = await getCurrentSession();

  // THE SLUG WILL BE "@" + THE USER'S UNIQUE USERNAME
  const { slug } = await params;
  const profileSlug = decodeURIComponent(slug);
  const { profile } = await getProfileWithSlug(profileSlug);

  if (!profile) {
    return notFound();
  }

  const posts = await getPostsByUser(profile.userId);

  // console.log(profile);

  // const profileData = await getProfileDataWithSlug(slug)
  // Posts, comments, bookmarks

  return (
    <div className="brder-2 container mx-auto space-y-4 border-red-500 py-4 lg:w-4/6">
      {/*BIO CARD*/}
      <BioCard {...profile} />

      <div className="p4 space-y-4 lg:grid lg:grid-cols-6 lg:gap-8 lg:space-y-0">
        {/*ABOUT CARD*/}
        <div className="col-span-2">
          <AboutCard about={profile.about || ""} />
        </div>

        {/*RECENTLY PUBLISHED*/}
        <div className="col-span-4">
          <p className="mb-4 px-8 text-xl font-semibold md:px-4">
            Recently published
          </p>
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard
                key={post.id}
                article={{ author: profileSlug.slice(1), ...post }}
              />
            ))
          ) : (
            <div className="boder mx-auto w-fit space-y-4 border-red-500 py-12 text-center align-middle">
              <p className="flex justify-center">
                <MdOutlineArticle className="text-2xl text-gray-700 dark:text-gray-400" />
              </p>
              <p className="text-xl font-semibold">No posts yet</p>
              <p className="text-sn text-gray-700 dark:text-gray-400">
                {profile.firstName || profileSlug.slice(1)} has not published
                any article yet.
              </p>
            </div>
          )}

          {/*WIP: PAGINATION*/}
          <div className="mx-auto w-fit">
            <button
              type="button"
              className="ustify-center my-12 flex items-center space-x-2 text-gray-700 dark:text-gray-400"
            >
              <span className="">Load more</span>
              <IoArrowDown className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
