"use client";

import { useActionState, useEffect, useState } from "react";
import { CommentFormProps } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CommentFormSchema } from "@/lib/definitions";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import AuthenticationDialogue from "@/components/auth/AuthenticationDialogue";

export default function CommentForm({
  action,
  value,
  setOpenSettings,
  setIsEditing,
  currentUser,
}: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    value,
    error: {},
  });

  const {
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(CommentFormSchema),
    values: state.value,
    errors: state.error,
    mode: "onBlur",
  });

  const [showAuthenticationDialogue, setShowAuthenticationDialogue] =
    useState(false);

  const router = useRouter();

  const { hasCommentChanged, serverError, isSubmitSuccessful } = state;

  const editorStatus = {
    updating: value.comment !== "",
    creating: value.comment === "",
  };

  useEffect(() => {
    if (serverError) {
      toast.error("Failed to create comment");
    }
  }, [serverError]);

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      toast.success(
        editorStatus.updating ? "Comment updated!" : "Comment added!",
      );

      reset({ comment: "" });

      if (setOpenSettings && setIsEditing) {
        setOpenSettings(false);
        setIsEditing(false);
      }

      router.refresh();
    }
  }, [isSubmitSuccessful, reset, editorStatus.updating]);

  useEffect(() => {
    if (hasCommentChanged !== undefined) {
      if (editorStatus.updating && !hasCommentChanged)
        toast.error("No changes made to comment");
    }
  }, [hasCommentChanged]);

  return (
    <>
      <div className="pb-4">
        {/*Will place current user's avatar and name*/}
        <form
          onFocus={() => {
            if (currentUser === undefined) {
              setShowAuthenticationDialogue(true);
            }
            if (setOpenSettings) {
              setOpenSettings(false);
            }
          }}
          className="space-y-2"
          action={formAction}
        >
          <input name="postId" value={value.postId} type="hidden" />
          <input name="userId" value={value.userId} type="hidden" />
          <input name="commentId" value={value.commentId} type="hidden" />
          <input name="oldComment" value={value.comment} type="hidden" />
          <div className="hello">
            <Controller
              name="comment"
              control={control}
              disabled={isPending}
              render={({ field }) => (
                <>
                  <MarkdownEditor {...field} />
                  <input
                    type="hidden"
                    name="comment"
                    value={field.value || ""}
                  />
                </>
              )}
            />
          </div>
          {currentUser !== undefined && (
            <p role="alert" className="mt-1 text-xs text-red-500 md:text-base">
              {errors.comment?.message}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-purple-600 px-4 py-2 text-white"
          >
            Send
          </button>
        </form>
      </div>
      <AuthenticationDialogue
        setShowAuthenticationDialogue={setShowAuthenticationDialogue}
        showDialogue={showAuthenticationDialogue}
      />
    </>
  );
}
