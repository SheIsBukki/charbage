"use client";

import { redirect, useRouter } from "next/navigation";
import { deleteFeaturedImageEverywhere } from "@/lib/deleteFeaturedImageEverywhere";
import { DbActionType } from "@/lib/types";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { ConfirmDeletionDialog } from "@/app/ui/ConfirmDeletionDialog";
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
    await deleteFeaturedImageEverywhere(featuredImage || "", authorId);
    await deletePostAction(postId);
    redirect("/");
  };

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex items-center space-x-1 rounded-full bg-red-500 px-4 py-1 text-white">
            <RiDeleteBinLine className="" />
            <span className="">Delete</span>
          </button>
        </AlertDialogTrigger>
        <ConfirmDeletionDialog
          itemToDelete={"post"}
          deleteItemAction={handleDeletePost}
        />
      </AlertDialog>
    </>
  );
}
