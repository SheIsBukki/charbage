import { redirect, useRouter } from "next/navigation";
import { deleteFeaturedImageEverywhere } from "@/lib/deleteFeaturedImageEverywhere";
import { DeletePostActionType } from "@/lib/types";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

export default function ArticleSettings({
  postId,
  authorId,
  postSlug,
  featuredImage,
  deletePostAction,
}: {
  postId: string;
  authorId: string;
  postSlug: string;
  featuredImage: string | null;
  deletePostAction: DeletePostActionType;
}) {
  const router = useRouter();

  return (
    <>
      <button
        className="flex items-center space-x-1 rounded-full bg-gray-200 px-4 py-1 lg:justify-start dark:bg-gray-700"
        onClick={() => {
          router.push(`/write/${postSlug}`);
        }}
      >
        <FiEdit />
        <span className="">Edit</span>
      </button>
      <button
        className="flex items-center space-x-1 rounded-full bg-red-500 px-4 py-1 text-white"
        onClick={async () => {
          await deleteFeaturedImageEverywhere(featuredImage || "", authorId);
          await deletePostAction(postId);
          redirect("/");
        }}
      >
        <RiDeleteBinLine className="" />
        <span className="">Delete</span>
      </button>
    </>
  );
}
