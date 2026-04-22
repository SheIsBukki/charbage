import { useState } from "react";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaRegCalendarAlt,
  FaShare,
} from "react-icons/fa";
import { regularDate } from "@/utils/helpers";
import { Profile } from "@/db/schema";
import SocialShare from "@/app/ui/SocialShare";

export default function BioCard({
  firstName,
  lastName,
  slug,
  bio,
  socialLinks,
  avatar,
  createdAt,
}: Profile) {
  type SocialLinks = { github: string; linkedin: string };

  const [openShareMenu, setOpenShareMenu] = useState(false);
  const { github, linkedin }: SocialLinks = JSON.parse(socialLinks || "");
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();

  return (
    <section className="relative flex w-full space-x-6 border-b p-4 pb-8 text-sm text-gray-700 dark:text-gray-400">
      {/*AVATAR*/}
      <div className="">
        <figure className="ctive:scale-150 size-20 space-y-4 rounded-full ring-2 sm:size-24">
          <img
            src={avatar || "/avatar-default-svgrepo-com.svg"}
            alt="Profile avatar"
            className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)] active:scale-150"
          />
        </figure>
      </div>

      <div className="w-full space-y-3">
        {/*Profile Name and Share Button*/}
        <div className="items-center justify-between space-y-2 md:flex md:space-y-0">
          <div className="">
            <p className="text-xl font-bold dark:text-gray-50">
              {fullName || slug?.slice(1)}
            </p>
            <span className="">{slug}</span>
          </div>

          {/*Share profile button*/}
          <button
            onClick={() => setOpenShareMenu(!openShareMenu)}
            type="button"
            className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            <FaShare /> <span className="">Share</span>
          </button>
          <SocialShare
            openShareMenu={openShareMenu}
            slug={slug || ""}
            shortText={bio || ""}
            postOrProfile="profile"
          />
        </div>

        {/*BIO*/}
        {bio && <p className="w-it brder border-red-500">{bio}</p>}

        {/*DATE JOINED*/}
        <p className="flex items-center space-x-2">
          <FaRegCalendarAlt />
          <span className="">Joined {regularDate(createdAt)}</span>
        </p>

        {/*SOCIAL LINKS*/}
        <div className="brder flex items-center space-x-4 border-red-500">
          {github && (
            <Link href={github}>
              <FaGithub className="text-l" />
            </Link>
          )}
          {linkedin && (
            <Link href={linkedin}>
              <FaLinkedin className="text-l" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
