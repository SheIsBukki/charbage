"use client";

import { ArticleFormSchema } from "@/lib/definitions";
import React, { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import Form from "next/form";
import { ActionState, PostFormValues } from "@/app/write/page";

type ArticleFormProps = {
  action: (
    initialState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  values: PostFormValues;
};

const ErrorMessage = ({ message }: { message: string | undefined }) => (
  <p role="alert" className="my-1 text-xs text-red-500 md:text-base">
    {message}
  </p>
);

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

  return (
    <div className="container mx-auto w-[80%] lg:w-[70%]">
      <Form action={formAction}>
        <div className="my-2 flex w-full place-content-center place-items-center justify-between space-x-4 px-2">
          <div className="w-full py-4">
            <input
              id="title"
              aria-describedby="title-error"
              type="text"
              className="h-fit w-full px-1 py-2 text-start text-lg outline-0 md:text-3xl"
              placeholder="Your blog title..."
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && <ErrorMessage message={errors.title.message} />}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="rounded-full bg-purple-500 px-4 py-2 text-white md:text-lg"
          >
            {isPending ? "Publishing" : "Publish"}
          </button>
        </div>

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
      </Form>
    </div>
  );
}
