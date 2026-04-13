import { notFound } from "next/navigation";
import { MdOutlineArticle } from "react-icons/md";
import BioCard from "@/components/profile/BioCard";
import { getCurrentSession } from "@/lib/session";
import { getPostsByUser, getProfileWithSlug } from "@/db/queries/select";
import AboutCard from "@/components/profile/AboutCard";
import ProfileSideBar from "@/components/profile/ProfileSideBar";
import PaginatedArticleCards from "@/components/articles/PaginatedArticleCards";
import ProfilePageClient from "@/app/[slug]/ProfilePageClient";

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
  const { slug } = await params;
  const profileSlug = decodeURIComponent(slug);
  const { profile } = await getProfileWithSlug(profileSlug);
  if (!profile) {
    return notFound();
  }
  const { posts } = await getPostsByUser(profile.userId);
  const postArr = [];
  if (posts) {
    postArr.push(...posts);
  }

  const { user: currentUser } = await getCurrentSession();
  const { profile: currentUserProfile } = await getProfileWithSlug(
    `@${currentUser?.username}`,
  );
  // console.log(profile);

  // Posts, comments, bookmarks

  return (
    profile && (
      <div className="py4 bordr-2 bottom-0 mx-auto flex h-full w-full border-red-500">
        <ProfilePageClient
          postArr={postArr}
          currentUserProfile={currentUserProfile}
          profileInView={profile}
        />
      </div>
    )
  );
}
