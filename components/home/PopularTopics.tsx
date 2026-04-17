import Link from "next/link";
import { Tag } from "@/db/schema";

export default function PopularTopics({
  popularTopics,
}: {
  popularTopics: Tag[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {popularTopics.map((topic, index) => (
        <span
          key={index}
          className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800"
        >
          <Link href={topic.slug}>{topic.name}</Link>
        </span>
      ))}
    </div>
  );
}
