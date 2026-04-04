"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/db/schema";
import VerifyAccountDelete from "@/components/profile/VerifyAccountDelete";

export function ConfirmDeletionDialogue({
  itemToDelete,
  deleteItemAction,
  currentUser,
}: {
  itemToDelete: string;
  deleteItemAction: () => Promise<void>;
  currentUser?: User;
}) {
  const pathname = usePathname();
  const [usernameInput, setUsernameInput] = useState("");
  const [deleteMyAccountInput, setDeleteMyAccountInput] = useState("");

  const verifyAuthorisedUser =
    (usernameInput === currentUser?.username ||
      usernameInput === currentUser?.email) &&
    deleteMyAccountInput === "delete my account";

  return (
    <AlertDialogContent size="default">
      <AlertDialogTitle>Delete {itemToDelete}?</AlertDialogTitle>
      <AlertDialogDescription>
        {!pathname.startsWith("/settings") ? (
          `This will permanently delete your ${itemToDelete}. Are you sure you
          want to continue?`
        ) : (
          <span className="sr-only">
            This is extremely important. We will immediately delete this account
            along with all your posts, comments, bookmarks, and likes. Deleting
            your account is permanent and will free up your username.
          </span>
        )}
      </AlertDialogDescription>

      {pathname.startsWith("/settings") && (
        <VerifyAccountDelete
          usernameInput={usernameInput}
          setUsernameInput={setUsernameInput}
          deleteMyAccountInput={deleteMyAccountInput}
          setDeleteMyAccountInput={setDeleteMyAccountInput}
        />
      )}

      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={deleteItemAction}
          variant="destructive"
          disabled={pathname.startsWith("/settings") && !verifyAuthorisedUser}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
