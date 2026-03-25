import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDeletionDialog({
  itemToDelete,
  deleteItemAction,
}: {
  itemToDelete: string;
  deleteItemAction: () => Promise<void>;
}) {
  return (
    <AlertDialogContent size="sm">
      <AlertDialogTitle>Delete {itemToDelete}?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete your {itemToDelete}. Are you sure you want
        to continue?
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deleteItemAction} variant="destructive">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
