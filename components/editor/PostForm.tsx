"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { createPost } from "@/db/queries/insert";
import { ArticleFormSchema } from "@/lib/definitions";
import FeaturedImage from "@/components/editor/FeaturedImage";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import TagForm from "@/components/tag/TagForm";
import toast from "react-hot-toast";

export default function PostForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: { title: "", content: "", featuredImage: "" },
    mode: "onBlur",
  });

  const [openTagForm, setOpenTagForm] = useState(false);

  let imageUrl = "";

  const onSubmit = async (data: {
    title: string;
    content: string;
    featuredImage?: string;
  }) => {
    const parsed = ArticleFormSchema.safeParse(data);

    if (!parsed.success) {
      return { errors: parsed.error.flatten() };
    }

    const post = await createPost(parsed.data);

    if (post.data) {
      toast.success("Yayy! You published an article! 🚀");
    } else {
      toast.error("Sorry, something went wrong. Article not published");
    }

    const publishedArticle = post.data;
    const featuredImage = publishedArticle?.featuredImage ?? "";
    imageUrl = featuredImage;

    console.log(publishedArticle);
    console.log(publishedArticle?.featuredImage);
    console.log(JSON.stringify(publishedArticle, null, 4));
    reset();
    return { post, errors: {} };
  };

  const ErrorMessage = ({ message }: { message: string | undefined }) => (
    <p role="alert" className="mt-1 text-xs text-red-500 md:text-base">
      {message}
    </p>
  );

  return (
    <div className="mx-auto w-full">
      {/*TAG*/}
      <div className="">
        {/*This creates a new tag*/}
        {openTagForm && (
          <div className="relative mx-auto h-full w-full">
            <div className="absolute z-50 mx-auto w-full rounded-lg bg-gray-100 px-4 py-20 md:px-36 md:py-48 lg:px-48 dark:bg-gray-900">
              <div className="w-full">
                <button
                  className="relative bottom-10 w-full place-items-end space-x-2 rounded-lg px-4 py-2 text-3xl md:bottom-20"
                  onClick={() => setOpenTagForm(false)}
                >
                  <MdClose className="size-12 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" />
                </button>
              </div>

              <TagForm />
            </div>
          </div>
        )}
      </div>

      <div className="[h-50]">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/*Featured Image*/}
          <div className="">
            <Controller
              name="featuredImage"
              control={control}
              disabled={isSubmitting}
              render={() => (
                <>
                  <FeaturedImage />
                  <input value={imageUrl} type="hidden" name="featuredImage" />
                </>
              )}
            />
            {errors.featuredImage && (
              <ErrorMessage message={errors.featuredImage.message} />
            )}
          </div>

          {/*Title*/}
          <div className="my-2 w-full px-2">
            <textarea
              id="title"
              aria-describedby="title-error"
              className="h-full w-full px-1 py-2 text-lg outline-0 focus:outline-0 md:text-3xl"
              placeholder="Your blog title..."
              {...register("title")}
              rows={2}
              required
              disabled={isSubmitting}
            />

            {errors.title && <ErrorMessage message={errors.title.message} />}
          </div>

          <div className="flex w-full items-center justify-between space-x-4 text-sm md:justify-end md:space-x-6 md:text-base">
            {/*TAG CREATE FORM MODAL BUTTON*/}
            <button
              type="button"
              onClick={() => setOpenTagForm(true)}
              className="mb-4 mt-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Create a tag
            </button>

            <button
              type="button"
              className="mb-4 mt-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Select a tag
            </button>
          </div>

          {/*Markdown Content*/}
          <div className="container mx-auto w-full">
            <Controller
              name="content"
              control={control}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              type="submit"
              className="w-full rounded-full bg-purple-500 px-4 py-2 text-white md:text-lg"
            >
              {isSubmitting ? "Publishing" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
