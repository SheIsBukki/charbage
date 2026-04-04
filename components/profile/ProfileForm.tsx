"use client";

import { useActionState, useEffect } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ProfileFormProps } from "@/lib/types";
import { ProfileFormSchema } from "@/lib/definitions";
import { ErrorMessage } from "@/app/ui/ErrorMessage";
import AvatarOrFeaturedImage from "@/app/ui/AvatarOrFeaturedImage";

export default function ProfileForm({
  action,
  values,
  slug,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    values: values,
    errors: {},
  });

  const {
    register,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(ProfileFormSchema),
    values: state.values,
    errors: state.errors,
    mode: "onBlur",
  });

  const { serverError, isSubmitSuccessful } = state;
  const router = useRouter();

  useEffect(() => {
    if (serverError) toast.error("Failed to update profile");
  }, [serverError]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast.success("Profile successfully updated");

      router.push(`/${slug}`);
    }
  }, [isSubmitSuccessful]);

  return (
    <div>
      <Form
        className="borer w-full space-y-4 border-red-500"
        action={formAction}
      >
        <input type="hidden" name="profileId" value={values.profileId} />
        {/*AVATAR*/}
        <div className="w-fit">
          <Controller
            disabled={isPending}
            name="avatar"
            control={control}
            render={() => (
              <>
                <AvatarOrFeaturedImage
                  dynamicId={values.profileId}
                  imageUrl={values.avatar}
                />
              </>
            )}
          ></Controller>
          {errors.avatar && <ErrorMessage message={errors.avatar.message} />}
        </div>

        {/*First and Last name*/}
        <section className="borer flex flex-col space-y-2 border-red-500 md:flex-row md:gap-x-4 md:space-y-0">
          {/*FIRSTNAME*/}
          <div className="w-full space-y-1">
            <label className="flex flex-col space-y-1" htmlFor="firstname">
              <span className="font-semibold">First Name</span>
              <input
                className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
                id="firstname"
                {...register("firstname")}
                type="text"
                placeholder="First Name"
              />
            </label>
            {errors.firstname && (
              <ErrorMessage message={errors.firstname.message} />
            )}
          </div>

          {/*LASTNAME*/}
          <div className="w-full space-y-1">
            <label className="flex flex-col space-y-1" htmlFor="lastname">
              <span className="font-semibold">Last Name</span>
              <input
                className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
                id="lastname"
                {...register("lastname")}
                type="text"
                placeholder="Last Name"
              />
            </label>
            {errors.lastname && (
              <ErrorMessage message={errors.lastname.message} />
            )}
          </div>
        </section>

        {/*BIO*/}
        <section className="">
          <label className="flex flex-col space-y-1" htmlFor="bio">
            <span className="font-semibold">Bio</span>
            <textarea
              placeholder="A short line that appears under your name"
              id="bio"
              {...register("bio")}
              rows={3}
              className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
            />
          </label>
          {errors.bio && <ErrorMessage message={errors.bio.message} />}
        </section>

        {/*ABOUT*/}
        <section className="">
          <label className="flex flex-col space-y-1" htmlFor="about">
            <span className="font-semibold">About</span>
            <textarea
              placeholder="Tell use a little bit about you"
              id="about"
              {...register("about")}
              rows={8}
              className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
            />
          </label>
          {errors.about && <ErrorMessage message={errors.about.message} />}
        </section>

        {/*SOCIAL LINKS*/}
        <section className="space-y-4">
          <div className="">
            <p className="font-semibold">Social links</p>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Adding social links is optional
            </span>
          </div>

          {/*GITHUB*/}
          <div className="">
            <label className="flex items-center space-x-2" htmlFor="github">
              <span className="rounded-l-md border-2 bg-gray-100 p-2 dark:bg-gray-700">
                <FaGithub className="" />
              </span>
              <input
                placeholder="https://github.com/your-handle"
                type="text"
                className="w-full rounded-r-md border-2 bg-gray-50 px-2 py-1 placeholder:text-sm dark:bg-[revert]"
                id="github"
                {...register("github")}
              />
            </label>
            {errors.github && <ErrorMessage message={errors.github.message} />}
          </div>

          {/*LINKEDIN*/}
          <div className="">
            <label
              className="boder flex items-center space-x-2 border-red-500"
              htmlFor="linkedin"
            >
              <span className="rounded-l-md border-2 bg-gray-100 p-2 dark:bg-gray-700">
                <FaLinkedin className="" />
              </span>
              <input
                placeholder="https://www.linkedin.com/in/your-profile"
                type="text"
                className="w-full rounded-r-md border-2 bg-gray-50 px-2 py-1 placeholder:text-sm dark:bg-[revert]"
                id="linkedin"
                {...register("linkedin")}
              />
            </label>
            {errors.linkedin && (
              <ErrorMessage message={errors.linkedin.message} />
            )}
          </div>
        </section>

        <button
          type="submit"
          className="rounded-md bg-purple-500 px-4 py-2 text-white md:text-lg"
        >
          {isPending ? "Updating" : "Update profile"}
        </button>
      </Form>
    </div>
  );
}
