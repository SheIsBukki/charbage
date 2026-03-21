import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { DbActionType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function CommentSettings({
  deleteCommentAction,
  commentId,
  isEditing,
  setIsEditing,
}: {
  deleteCommentAction: DbActionType;
  commentId: string;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={async () => {
          await deleteCommentAction(commentId);
          router.refresh();
        }}
        className=""
      >
        <RiDeleteBinLine />
      </button>
      <button className="" onClick={() => setIsEditing(!isEditing)}>
        <FiEdit />
      </button>
    </>
  );
}
