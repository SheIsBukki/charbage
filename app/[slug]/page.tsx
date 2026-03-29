import { getCurrentSession } from "@/lib/session";
import { getProfileWithSlug } from "@/db/queries/select";
import { notFound } from "next/navigation";
import { regularDate } from "@/utils/helpers";
import { FaGithub, FaLinkedin, FaShare } from "react-icons/fa";
import Link from "next/link";

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
    description: `${fullName || profileSlug}'s profile page`, // Until user's short bio hence user?.bio
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

  const socialLinks = JSON.parse(profile.socialLinks || "");
  // console.log(profile);

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  // const profileData = await getProfileDataWithSlug(slug)
  // Posts, comments, bookmarks

  // console.log(socialLinks);

  return (
    <div className="boder-red-500 border">
      {/*BIO CARD*/}
      <section className="flex w-full space-x-4 dark:text-gray-400">
        {/*{profile.avatar && (*/}
        <figure className="size-20 space-y-4 rounded-full ring-2 sm:size-24">
          <img
            src={profile.avatar || "/avatar-default-svgrepo-com.svg"}
            alt="Profile avatar"
            className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)]"
          />
        </figure>
        {/*)}*/}

        <div className="">
          {/*Profile Name and Share Button*/}
          <div className="bordr-red-500 boder flex w-full items-center justify-between">
            <div className="">
              <p
                style={{ color: "initial" }}
                // style={{ color: "unset" }}
                // style={{ color: "revert" }}
                className="text-xl font-bold [color:initial]"
              >
                {fullName || profileSlug.slice(1)}
              </p>
              <span className="">{profileSlug}</span>
            </div>

            <div className="">
              {/*Users will be able to copy the profile url*/}
              <button
                type="button"
                className="flex items-center space-x-2 rounded-l bg-indigo-600 px-4 py-2 text-white"
              >
                <FaShare /> <span className="">Share</span>
              </button>
            </div>
          </div>

          {profile.bio && <p className="">{profile.bio}</p>}
          <span className="">Joined {regularDate(profile.createdAt)}</span>
          {socialLinks.github && (
            <Link href={socialLinks.github}>
              <FaGithub />
            </Link>
          )}

          {socialLinks.linkedin && (
            <Link href={socialLinks.linkedin}>
              <FaLinkedin />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
