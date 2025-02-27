"use client";

import React, { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Form from "next/form";
import { ArticleFormSchema } from "@/lib/definitions";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { ActionState, PostFormValues } from "@/app/write/page";
import FeaturedImage from "@/components/editor/FeaturedImage";

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
  });

  const ErrorMessage = ({ message }: { message: string | undefined }) => (
    <p role="alert" className="my-1 text-xs text-red-500 md:text-base">
      {message}
    </p>
  );

  return (
    <div className="container mx-auto w-[80%] lg:w-[70%]">
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
        <div className="m-2 w-full">
          <textarea
            id="title"
            aria-describedby="title-error"
            // type="text"
            className="h-full w-full px-1 py-2 text-lg outline-0 focus:outline-0 md:text-3xl"
            placeholder="Your blog title..."
            {...register("title")}
            disabled={isPending}
          />
          {errors.title && <ErrorMessage message={errors.title.message} />}
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
                <input type="hidden" name="content" value={field.value || ""} />
              </>
            )}
          />
          {errors.content && <ErrorMessage message={errors.content.message} />}
        </div>

        {/*Publish button*/}
        <div className="mt-6 w-full">
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
  );
}
