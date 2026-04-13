import { useForm } from "react-hook-form";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { GrAlert } from "react-icons/gr";
import { AccountSettingsFormSchema } from "@/lib/definitions";
import { AccountSettingsFormProps } from "@/lib/types";
import { ErrorMessage } from "@/app/ui/ErrorMessage";
import { useDebouncedDuplicate } from "@/utils/useDebouncedDuplicate";

export default function AccountSettings({
  action,
  values,
}: AccountSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    values: values,
    errors: {},
  });

  const [usernameDuplicateError, setUsernameDuplicateError] = useState("");

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AccountSettingsFormSchema),
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

      router.refresh();
    }
  }, [isSubmitSuccessful]);

  const handleDuplicateUsername = useDebouncedDuplicate(500);

  return (
    <div className="h-full space-y-4">
      <div className="space-y-2">
        <p className="flex items-center space-x-2 border-b-2 pb-2">
          <GrAlert className="text-xl text-yellow-500" />
          <span className="">Warning</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Changing your email address or username can have unintended side
          effects. So, be sure that you want to update your email address or
          username before clicking the{" "}
          <span className="text-pretty font-mono font-thin">
            Update account
          </span>{" "}
          button
        </p>
      </div>
      <form
        onChange={(e) => {
          if (
            e.target.name === "username" &&
            e.target.value.trim() !== "" &&
            e.target.value.toLowerCase() !== values.username
          ) {
            handleDuplicateUsername(setUsernameDuplicateError, e.target.value);
          }
        }}
        action={formAction}
        className="borde-red-500 w-full space-y-4 rounded-md border bg-gray-100 p-4 dark:bg-gray-950"
      >
        <input type="hidden" className="" name="userId" value={values.userId} />
        <section className="w-full space-y-1">
          <label htmlFor="username" className="flex flex-col space-y-1">
            <span className="font-semibold">Username</span>
            <input
              {...register("username", { required: true })}
              required
              id="username"
              name="username"
              type="text"
              className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
            />
          </label>
          {(errors.username || usernameDuplicateError) && (
            <ErrorMessage
              message={usernameDuplicateError || errors?.username?.message}
            />
          )}
        </section>
        <section className="w-full space-y-1">
          <label htmlFor="email" className="flex flex-col space-y-1">
            <span className="font-semibold">Email</span>
            <input
              {...register("email", { required: true })}
              required
              id="email"
              name="email"
              type="text"
              className="rounded-md border-2 bg-gray-50 px-2 py-1 dark:bg-[revert]"
            />
          </label>
          {errors.email && <ErrorMessage message={errors.email.message} />}
        </section>

        <button
          type="submit"
          className="rounded-md bg-purple-500 px-4 py-2 text-white md:text-lg"
        >
          {isPending ? "Updating" : "Update account"}
        </button>
      </form>
    </div>
  );
}
