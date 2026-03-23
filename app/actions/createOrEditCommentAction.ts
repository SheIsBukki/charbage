"use server";

import { CommentActionState, CommentFormValue } from "@/lib/types";
import { CommentFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { updateComment } from "@/db/queries/update";
import { createComment } from "@/db/queries/insert";

export const createOrEditCommentAction = async (
  initialState: CommentActionState,
  formData: FormData,
) => {
  const value: CommentFormValue = {
    comment: String(formData.get("comment") || ""),
    postId: String(formData.get("postId") || ""),
    userId: String(formData.get("userId") || ""),
    commentId: String(formData.get("commentId")),
    oldComment: String(formData.get("oldComment")),
  };

  const { error: parseError } = CommentFormSchema.safeParse(value);

  const error: CommentActionState["error"] = {};

  if (parseError) {
    error["message"] = parseError;
  }

  const hasCommentChanged =
    value.oldComment === undefined
      ? undefined
      : !!value.commentId &&
        !value.userId &&
        value.comment !== value.oldComment;

  let serverError = false;
  let isSubmitSuccessful;

  if (value.comment.trim() !== "") {
    let comment;
    let success = "";

    const editorStatus = {
      updating: !!value.commentId && !!value.oldComment,
      creating: !!value.postId && !!value.userId && !value.commentId,
    };

    if (editorStatus.updating && hasCommentChanged) {
      comment = await updateComment(value?.commentId || "", value?.comment);
      if (comment.result) success = comment.result;
    }

    if (editorStatus.creating && value.postId && value.userId) {
      comment = await createComment(value.comment, value.postId, value.userId);
      if (comment.data) success = "Comment created successfully";
    }

    if (comment?.error) {
      serverError = true;
    } else if (success) {
      isSubmitSuccessful = true;
    }

    revalidatePath("/blog");
  }

  return {
    value,
    error: {},
    serverError: serverError,
    isSubmitSuccessful: isSubmitSuccessful,
    hasCommentChanged: hasCommentChanged,
  };
};
