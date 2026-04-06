import { redirect } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ConfirmDeletionDialogue } from "@/app/ui/ConfirmDeletionDialogue";
import { User } from "@/db/schema";
import { deleteUser } from "@/db/queries/delete";

export default function DangerZone({ user }: { user: User }) {
  const handleDeleteAccount = async () => {
    await deleteUser(user.id);
    // console.log("Delete account");
    redirect("/");
  };

  return (
    <div className="space-y-4 rounded-lg border-2 border-red-500 p-4">
      <p className="flex w-full items-center justify-between border-b-2 pb-2">
        <span className="font-semibold text-red-500 md:text-xl">
          Danger Zone
        </span>
        <span className="text-xs font-semibold md:text-base">
          Delete your account
        </span>
      </p>

      <p className="text-pretty text-sm leading-relaxed dark:text-gray-200">
        Once you delete your account, there is no going back. Please be certain.
        Your personal data will be deleted permanently when you delete your
        account on Charbage. All the articles you wrote will be deleted as well
        and cannot be restored. This action is irreversible.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="rounded-lg bg-red-500 p-2 font-semibold text-white">
            Delete account
          </button>
        </AlertDialogTrigger>
        <ConfirmDeletionDialogue
          itemToDelete={"account"}
          currentUser={user}
          deleteItemAction={handleDeleteAccount}
        />
      </AlertDialog>
    </div>
  );
}
