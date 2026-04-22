"use client";

import { redirect, useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { deleteAvatarOrFeaturedImage } from "@/utils/deleteAvatarOrFeaturedImage";
import { DbActionType } from "@/lib/types";
import { ConfirmDeletionDialogue } from "@/app/ui/ConfirmDeletionDialogue";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  deletePostAction: DbActionType;
}) {
  const router = useRouter();

  const handleDeletePost = async () => {
    await deleteAvatarOrFeaturedImage(featuredImage || "", authorId);
    await deletePostAction(postId);
    redirect("/");
  };

  return (
    <>
      <button
        className="brder flex w-full items-center space-x-3 rounded border-red-500 px-4 py-2 hover:bg-gray-200 lg:justify-start lg:space-x-2 lg:rounded lg:bg-gray-200 lg:py-1 dark:hover:bg-gray-700 lg:dark:bg-gray-700"
        onClick={() => {
          router.push(`/write/${postSlug}`);
        }}
      >
        <FiEdit className="text-2xl" />
        <span className="">Edit</span>
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="wfull flex items-center space-x-3 rounded px-4 py-2 hover:bg-gray-200 lg:space-x-2 lg:bg-red-500 lg:py-1 lg:text-white hover:lg:bg-red-500 dark:hover:bg-gray-700 dark:hover:lg:bg-red-500">
            <RiDeleteBinLine className="text-2xl" />
            <span className="">Delete</span>
          </button>
        </AlertDialogTrigger>
        <ConfirmDeletionDialogue
          itemToDelete={"post"}
          deleteItemAction={handleDeletePost}
        />
      </AlertDialog>
    </>
  );
}
