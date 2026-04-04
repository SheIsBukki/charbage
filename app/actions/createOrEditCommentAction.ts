"use server";

import { CommentActionState, CommentFormValues } from "@/lib/types";
import { CommentFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { updateComment } from "@/db/queries/update";
import { createComment } from "@/db/queries/insert";

export const createOrEditCommentAction = async (
  initialState: CommentActionState,
  formData: FormData,
) => {
  const values: CommentFormValues = {
    comment: String(formData.get("comment") || ""),
    postId: String(formData.get("postId") || ""),
    userId: String(formData.get("userId") || ""),
    commentId: String(formData.get("commentId")),
    oldComment: String(formData.get("oldComment")),
  };

  const { error: parseError } = CommentFormSchema.safeParse(values);

  const error: CommentActionState["error"] = {};

  if (parseError) {
    error["message"] = parseError;
  }

  const hasCommentChanged =
    values.oldComment === undefined
      ? undefined
      : !!values.commentId &&
        !values.userId &&
        values.comment !== values.oldComment;

  let serverError = false;
  let isSubmitSuccessful;

  if (values.comment.trim() !== "") {
    let comment;
    let success = "";

    const editorStatus = {
      updating: !!values.commentId && !!values.oldComment,
      creating: !!values.postId && !!values.userId && !values.commentId,
    };

    if (editorStatus.updating && hasCommentChanged) {
      comment = await updateComment(values?.commentId || "", values?.comment);
      if (comment.result) success = comment.result;
    }

    if (editorStatus.creating && values.postId && values.userId) {
      comment = await createComment(
        values.comment,
        values.postId,
        values.userId,
      );
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
    values: values,
    error: {},
    serverError: serverError,
    isSubmitSuccessful: isSubmitSuccessful,
    hasCommentChanged: hasCommentChanged,
  };
};
