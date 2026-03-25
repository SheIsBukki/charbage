import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { DbActionType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { ConfirmDeletionDialog } from "@/app/ui/ConfirmDeletionDialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

  const handleDeleteComment = async () => {
    await deleteCommentAction(commentId);
    router.refresh();
  };

  return (
    <>
      <button
        className="bg-gry-200 dark:bg-gay-700 flex items-center space-x-2 rounded-l px-6 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setIsEditing(!isEditing)}
      >
        <FiEdit className="text-xl" />
        <span className="">Edit</span>
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="bg-rd-500 txt-white flex items-center space-x-2 rounded-l px-6 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            <RiDeleteBinLine className="text-xl" />
            <span className="">Delete</span>
          </button>
        </AlertDialogTrigger>
        <ConfirmDeletionDialog
          deleteItemAction={handleDeleteComment}
          itemToDelete={"comment"}
        />
      </AlertDialog>
    </>
  );
}
