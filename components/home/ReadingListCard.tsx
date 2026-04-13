import Link from "next/link";
import Avatar from "@/app/ui/Avatar";
import { regularDate } from "@/utils/helpers";
import { currentUserBookmarksType } from "@/lib/types";

export default function ReadingListCard({
  title,
  postSlug,
  createdAt,
  authorName,
  authorSlug,
  authorAvatar,
  updatedAt,
}: currentUserBookmarksType) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Avatar
          avatarUrl={authorAvatar}
          alt="Author's avatar"
          defaultSize={5}
          mdToLgSize={8}
        />
        <span className="text-gray-600 dark:text-gray-400">
          <Link href={`/${authorSlug}`} className="">
            {authorName}
          </Link>
        </span>
      </div>

      <p className="text-lg font-bold">
        <Link href={`/blog/${postSlug}`} className="">
          {title}
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        {updatedAt ? "Updated" : "Published"}:{" "}
        {regularDate(updatedAt || createdAt)}
      </p>
    </div>
  );
}
