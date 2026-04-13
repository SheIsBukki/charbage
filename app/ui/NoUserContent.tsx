import { MdOutlineArticle } from "react-icons/md";

export default function NoUserContent({
  content,
  nameOfUser,
}: {
  content: string;
  nameOfUser?: string;
}) {
  const feedback =
    content === "bookmarks"
      ? "You have no posts on your reading list"
      : `${nameOfUser} has not published any article yet`;

  return (
    <div className="boder mx-auto w-fit space-y-4 border-red-500 py-12 text-center align-middle">
      <p className="flex justify-center">
        <MdOutlineArticle className="text-2xl text-gray-700 dark:text-gray-400" />
      </p>
      <p className="text-xl font-semibold">No {content} yet</p>
      <p className="text-sn text-gray-700 dark:text-gray-400">{feedback}</p>
    </div>
  );
}
