import Link from "next/link";
import Avatar from "@/app/ui/Avatar";
import { getRelativeTime } from "@/utils/helpers";
import { CurrentUserBookmarksType } from "@/lib/types";

export default function ArticleTitleCard({
  title,
  postSlug,
  createdAt,
  authorName,
  authorSlug,
  authorAvatar,
  updatedAt,
  showAuthor = true,
}: CurrentUserBookmarksType) {
  return (
    <div className="space-y-3">
      {showAuthor && (
        <div className="flex items-center space-x-3">
          {authorAvatar && (
            <Avatar
              avatarUrl={authorAvatar}
              alt="Author's avatar"
              defaultSize={5}
              mdToLgSize={8}
            />
          )}
          <span className="text-gray-600 dark:text-gray-400">
            <Link href={`/${authorSlug}`} className="">
              {authorName}
            </Link>
          </span>
        </div>
      )}

      <p className="font-bold">
        <Link href={`/blog/${postSlug}`} className="">
          {title}
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        {updatedAt ? "Updated" : "Published"}:{" "}
        {getRelativeTime(updatedAt || createdAt)}
      </p>
    </div>
  );
}
