"use client";

import React, { useActionState, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Form from "next/form";
import { MdClose } from "react-icons/md";
import { ArticleFormSchema } from "@/lib/definitions";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { ActionState, PostFormValues } from "@/app/write/page";
import FeaturedImage from "@/components/editor/FeaturedImage";
import TagForm from "@/components/tag/TagForm";

type ArticleFormProps = {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  values: PostFormValues;
};

export default function ArticleForm({ action, values }: ArticleFormProps) {
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

  const [openTagForm, setOpenTagForm] = useState(false);

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

      {/*ARTICLE*/}
      <div className="h-[50%]">
        <Form action={formAction}>
          {/*Featured Image*/}
          <div className="">
            <Controller
              name="featuredImage"
              control={control}
              disabled={isPending}
              render={() => (
                <>
                  <FeaturedImage />
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
              // type="text"
              className="h-full w-full px-1 py-2 text-lg outline-0 focus:outline-0 md:text-3xl"
              placeholder="Your blog title..."
              {...register("title")}
              rows={2}
              required
              disabled={isPending}
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
              {isPending ? "Publishing" : "Publish"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
