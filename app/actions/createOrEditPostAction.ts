"use server";

import { ArticleFormSchema } from "@/lib/definitions";
import slugify from "slugify";
import { updatePost } from "@/db/queries/update";
import { OldValues, PostActionStateType, PostFormValues } from "@/lib/types";
import { createPost } from "@/db/queries/insert";

export const createOrEditPostAction = async (
  initialState: PostActionStateType,
  formData: FormData,
) => {
  const values: PostFormValues = {
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    content: String(formData.get("content")),
    featuredImage: String(formData.get("featuredImage") || ""),
  };

  const oldValues: OldValues = JSON.parse(String(formData.get("oldValues")));

  const { error: parseError } = ArticleFormSchema.safeParse(values);
  const errors: PostActionStateType["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  let isSubmitSuccessful;
  let serverError;

  const hasPostChanged = !oldValues.postId
    ? undefined
    : values.title !== oldValues.title ||
      values.description !== oldValues.description ||
      values.content !== oldValues.content ||
      values.featuredImage !== oldValues.featuredImage;

  const editorStatus = {
    updating:
      oldValues.title !== "" && oldValues.content !== "" && !!oldValues.slug,
    creating:
      oldValues.title === "" && oldValues.content === "" && !values.slug,
  };

  if (editorStatus.updating) {
    values.slug =
      oldValues.title === values.title
        ? oldValues.slug
        : encodeURIComponent(
            `${slugify(values.title.toLowerCase())}-${oldValues.slug.slice(-6)}`,
          );
  }

  // console.log(hasPostChanged);

  if (editorStatus.updating && hasPostChanged) {
    const updatedPost = await updatePost(oldValues.postId, values);
    // I need to retrieve tagId from localStorage
    if (updatedPost !== "Failed to update post") {
      isSubmitSuccessful = true;
      // revalidatePath("/write");
    } else {
      serverError = true;
    }
  }

  if (editorStatus.creating) {
    const post = await createPost(values);
    const publishedArticle = post.data;

    if (post.error) {
      serverError = true;
    }

    if (publishedArticle) {
      isSubmitSuccessful = true;
      values.slug = publishedArticle.slug;

      // await addTag(publishedArticle.id, tagId);
      // revalidatePath("/write");
    }
  }

  console.log(editorStatus);
  console.log(isSubmitSuccessful);
  console.log(values);

  return {
    values,
    errors: {},
    serverError: serverError,
    hasPostChanged: hasPostChanged,
    isSubmitSuccessful: isSubmitSuccessful,
  };
};
