"use server";

import { ArticleFormSchema } from "@/lib/definitions";
import slugify from "slugify";
import { updatePost } from "@/db/queries/update";
import { OldValues, PostActionStateType, PostFormValues } from "@/lib/types";
import { addTag, createPost } from "@/db/queries/insert";
import { Tag } from "@/db/schema";
import { removeTag } from "@/db/queries/delete";

export const createOrEditPostAction = async (
  initialState: PostActionStateType,
  formData: FormData,
) => {
  const values: PostFormValues = {
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    content: String(formData.get("content")),
    featuredImage: String(formData.get("featuredImage") || ""),
    tags: String(formData.get("tags")),
  };

  const tags: Tag[] = JSON.parse(values.tags || "");

  const oldValues: OldValues = JSON.parse(String(formData.get("oldValues")));

  const { error: parseError } = ArticleFormSchema.safeParse(values);
  const errors: PostActionStateType["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  let isSubmitSuccessful;
  let serverError;
  let tagServerErrorMessage;

  const hasPostChanged = !oldValues.postId
    ? undefined
    : values.title !== oldValues.title ||
      values.description !== oldValues.description ||
      values.content !== oldValues.content ||
      values.featuredImage !== oldValues.featuredImage ||
      values.tags !== oldValues.tags;

  const editorStatus = {
    updating:
      oldValues.title !== "" && oldValues.content !== "" && !!oldValues.slug,
    creating:
      oldValues.title === "" && oldValues.content === "" && !values.slug,
  };

  async function publishedPostsTagManager(postId: string) {
    const oldTags: Tag[] = JSON.parse(oldValues.tags);
    for (let tag of tags) {
      const alreadyAddedTagIndex = oldTags.findIndex(
        (oldTag) => oldTag.id === tag.id,
      );

      if (alreadyAddedTagIndex === -1) {
        const addedTag = await addTag(postId, tag.id);

        if (addedTag.error) {
          serverError = true;
          tagServerErrorMessage = `Failed to add tag ${tag} to post`;
        }
      }
    }

    for (let oldTag of oldTags) {
      const tagToRemoveIndex = tags.findIndex((tag) => tag.id === oldTag.id);
      if (tagToRemoveIndex === -1) {
        const removedTag = await removeTag(oldTag.id, postId);

        if (removedTag.error) {
          serverError = true;
          tagServerErrorMessage = `Failed to remove tag ${oldTag} from post`;
        }
      }
    }
  }

  if (editorStatus.updating) {
    values.slug =
      oldValues.title === values.title
        ? oldValues.slug
        : encodeURIComponent(
            `${slugify(values.title.toLowerCase())}-${oldValues.slug.slice(-6)}`,
          );
  }

  if (editorStatus.updating && hasPostChanged) {
    const updatedPost = await updatePost(oldValues.postId, values);

    if (updatedPost !== "Failed to update post") {
      isSubmitSuccessful = true;

      await publishedPostsTagManager(updatedPost.id);
      /*ADD OR REMOVE TAGS FROM A PREVIOUSLY PUBLISHED POST*/
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

      /*ADD TAGS TO NEW POSTS*/
      for (let tag of tags) {
        const addedTag = await addTag(publishedArticle.id, tag.id);

        if (addedTag.error) {
          serverError = true;
          tagServerErrorMessage = `Failed to add tag ${tag} to post`;
        }
      }
    }
  }

  return {
    values,
    errors: {},
    serverError: serverError,
    tagServerErrorMessage: tagServerErrorMessage,
    hasPostChanged: hasPostChanged,
    isSubmitSuccessful: isSubmitSuccessful,
  };
};
