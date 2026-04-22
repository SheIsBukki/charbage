"use client";

import { useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Form from "next/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ArticleFormSchema } from "@/lib/definitions";
import { ArticleFormProps } from "@/lib/types";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import TagFormModal from "@/components/tag/TagFormModal";
import { ErrorMessage } from "@/app/ui/ErrorMessage";
import AvatarOrFeaturedImage from "@/app/ui/AvatarOrFeaturedImage";
import TagSelectionModal from "@/components/tag/TagSelectionModal";
import { Tag } from "@/db/schema";
import PreviewTags from "@/components/tag/PreviewTags";

export default function ArticleForm({
  tagData,
  action,
  values,
  userId,
  editorStatus,
}: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    values,
    errors: {},
  });

  const {
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ArticleFormSchema),
    values: state.values,
    errors: state.errors,
    mode: "onBlur",
    // mode: "onSubmit",
  });

  const { hasPostChanged, isSubmitSuccessful, tagServerErrorMessage } = state;

  const router = useRouter();

  useEffect(() => {
    if (hasPostChanged !== undefined) {
      if (editorStatus.updating && !hasPostChanged)
        toast.error("No changes have been made to post");
    }
  }, [hasPostChanged]);

  useEffect(() => {
    if (isSubmitSuccessful === true) {
      localStorage.removeItem("imagePreview");
      localStorage.removeItem("featuredImage");
      router.push(`/blog/${state.values.slug}`);
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (tagServerErrorMessage) {
      toast.error(tagServerErrorMessage);
    }
  }, [tagServerErrorMessage]);

  const oldValues = JSON.stringify(values);

  const tagValues = JSON.parse(values.tags);
  const [tags, setTags] = useState<Array<Tag>>(tagValues);

  const handleAddOrRemoveTag = (selectedTag: Tag) => {
    const tagIndex = tags.findIndex((tag) => tag.id === selectedTag.id);

    if (tagIndex !== -1) {
      setTags((prev) => [...prev].filter((tag) => tag.id !== selectedTag.id));
    } else if (tags.length < 3) {
      setTags((prev) => [...prev, selectedTag]);
    } else {
      toast("You cannot have more than 3 tags per post", {
        style: {
          background: "#a855f7",
          color: "#fff",
        },
      });
      return;
    }
  };

  return (
    <div className="brder container mx-auto my-8 border-red-500 px-2 pb-12 lg:w-3/5">
      {/*ARTICLE*/}
      <div className="h-[50%]">
        <Form action={formAction}>
          {/*All old values, including tags and featured image url*/}
          <input name="oldValues" value={oldValues} type="hidden" />

          {/*Tags*/}
          <input type="hidden" value={JSON.stringify(tags)} name="tags" />
          {/*Featured Image*/}
          <div className="my-6 w-fit">
            <Controller
              name="featuredImage"
              control={control}
              disabled={isPending}
              render={() => (
                <>
                  <AvatarOrFeaturedImage
                    imageUrl={values.featuredImage}
                    dynamicId={userId}
                  />
                </>
              )}
            />
            {errors.featuredImage && (
              <ErrorMessage message={errors.featuredImage.message} />
            )}
          </div>
          {/*Title*/}
          <div className="my-2 w-full">
            <textarea
              id="title"
              aria-describedby="title-error"
              className="h-full w-full bg-gray-50 px-1 py-2 text-lg outline-0 focus:outline-0 md:text-3xl dark:bg-[revert]"
              placeholder="Your blog title..."
              {...register("title")}
              rows={3}
              required
              disabled={isPending}
            />

            {errors.title && <ErrorMessage message={errors.title.message} />}
          </div>
          {/*Description*/}
          <div className="my-2 w-full">
            <textarea
              id="description"
              aria-describedby="description-error"
              className="h-full w-full bg-gray-50 px-1 py-2 text-lg outline-0 focus:outline-0 md:text-3xl dark:bg-[revert]"
              placeholder="Optional meta description..."
              {...register("description")}
              rows={5}
              disabled={isPending}
            />

            {errors.description && (
              <ErrorMessage message={errors.description.message} />
            )}
          </div>

          {/*TAG CREATE FORM MODAL AND TAG SEARCH MODAL*/}
          <div className="mb-4 flex w-full items-center justify-between space-x-4 text-sm md:justify-end md:space-x-4 md:text-base">
            {/*Looks like I don't need to even attempt to create the modal at all*/}
            <TagFormModal setTagsAction={setTags} tags={tags} />

            <TagSelectionModal
              tags={tags}
              tagData={tagData}
              handleAddOrRemoveTagAction={handleAddOrRemoveTag}
            />
          </div>
          {/*Preview selected TAGS*/}
          {tags.length > 0 && (
            <PreviewTags
              previewTags={tags}
              handleAddOrRemoveTagAction={handleAddOrRemoveTag}
            />
          )}

          {/*Markdown Content*/}
          <div className="container mx-auto w-full">
            <Controller
              name="content"
              control={control}
              disabled={isPending}
              render={({ field }) => (
                <>
                  <MarkdownEditor {...field} />
                  <input
                    type="hidden"
                    name="content"
                    value={field.value || ""}
                  />
                </>
              )}
            />
            {errors.content && (
              <ErrorMessage message={errors.content.message} />
            )}
          </div>
          {/*Publish button*/}
          <div className="mx-auto mt-6 w-[50%]">
            <button
              disabled={isPending}
              type="submit"
              className="w-full rounded-full bg-purple-500 px-4 py-2 text-white md:text-lg"
            >
              {editorStatus.creating ? (
                <>{isPending ? "Publishing" : "Publish"}</>
              ) : (
                <>{isPending ? "Updating" : "Update"}</>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
