import { getCurrentSession } from "@/lib/session";
import { getUserWithUsername } from "@/db/queries/select";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const username = decodeURIComponent(slug).slice(1);
  const { user } = await getUserWithUsername(username);

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return {
    title: fullName || user?.username,
    description: `${fullName || user?.username}'s profile page`, // Until user's short bio hence user?.bio
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user: currentUser } = await getCurrentSession();

  // THE SLUG WILL BE THE USER'S UNIQUE "@" + USERNAME
  const { slug } = await params;
  const username = decodeURIComponent(slug).slice(1);
  const { user: profile } = await getUserWithUsername(username);

  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  // const profileData = await getProfileDataWithSlug(slug)
  // Posts, comments, bookmarks

  return <div>{fullName || profile?.username}&apos;s Profile Page</div>;
}
