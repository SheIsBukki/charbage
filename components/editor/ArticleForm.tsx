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
  <p role="alert" className="text-red-500">
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
              className="h-fit w-full py-2 text-start text-3xl outline-0"
              placeholder="Your blog title..."
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && <ErrorMessage message={errors.title.message} />}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="rounded-full bg-blue-500 px-4 py-2 text-lg text-white"
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
                <div className="">
                  <MarkdownEditor {...field} />
                  <input
                    type="hidden"
                    name="content"
                    value={field.value || ""}
                  />
                </div>
              </>
            )}
          />
          {errors.content && <ErrorMessage message={errors.content.message} />}
        </div>
      </Form>
    </div>
  );
}

// defaultValues: {
//   title: "",
//   markdownContent: "",
//   featuredImage: "",
//   tags: [],
// },

/**
 * async function onSubmit(data: z.infer<typeof ArticleFormSchema>) {
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await createPost(data);
      console.log("Blog Post Submitted:", data);

      toast({
        title: "Blog Post Created",
        description: `"${data.title}" submitted successfully!`,
      });

      reset();
    } catch (error) {
      toast({
        title: "Blog Post Submission Failed",
        description: "There was an error submitting your blog post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }
 * */
