"use client";

import React, { useActionState, useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { useRedirect } from "@/components/auth/useRedirect";
import { ErrorMessage } from "@/app/ui/ErrorMessage";
import { emailAlreadyExists, usernameAlreadyExists } from "@/db/queries/select";

const initialState = { message: "" };

type SignUpProps = {
  action: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message?: string; successful?: boolean } | undefined>;
  userAlreadyLoggedIn: boolean;
};

export default function SignUp({ userAlreadyLoggedIn, action }: SignUpProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [usernameDuplicateError, setUsernameDuplicateError] = useState("");
  // const [emailDuplicateError, setEmailDuplicateError] = useState("");
  useRedirect({ userAlreadyLoggedIn, state });

  const handleDuplicate = async (e: any) => {
    // if (e.target.name === "email" && e.target.value.trim() !== "") {
    //   const doesEmailExist = await emailAlreadyExists(e.target.value);
    //
    //   if (doesEmailExist.result) {
    //     setEmailDuplicateError(`Email "${e.target.value}" already exists`);
    //   }
    //   {
    //     setEmailDuplicateError("");
    //   }
    // }

    if (e.target.name === "username" && e.target.value.trim() !== "") {
      const doesUsernameExist = await usernameAlreadyExists(e.target.value);

      if (doesUsernameExist.result) {
        setUsernameDuplicateError(
          `Username "${e.target.value}" already exists`,
        );
      } else {
        setUsernameDuplicateError("");
      }
    }
  };

  return (
    <div className="container mx-auto md:w-[70%] md:p-12 lg:w-[50%] lg:p-16">
      <div className="w-full place-content-center place-items-center p-4">
        <h1 className="mb-3 text-center text-2xl">Create an account</h1>
        <Form action={formAction} className="w-full">
          <div className="flex-1 space-y-4 rounded-lg px-6 pb-4 pt-8">
            <div className="w-full space-y-8">
              {/*Username*/}
              <div className="">
                <label
                  htmlFor="username"
                  className="mb-3 mt-5 block text-xs font-medium"
                >
                  Username
                </label>

                <input
                  onBlur={(e) => handleDuplicate(e)}
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  // required
                />
                {usernameDuplicateError && (
                  <ErrorMessage message={usernameDuplicateError} />
                )}
              </div>

              {/*Email*/}
              <div className="">
                <label
                  htmlFor="email"
                  className="mb-3 mt-5 block text-xs font-medium"
                >
                  Email
                </label>

                <input
                  onBlur={(e) => handleDuplicate(e)}
                  type="email"
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  // required
                />
                {/*{emailDuplicateError && (*/}
                {/*  <ErrorMessage message={emailDuplicateError} />*/}
                {/*)}*/}
              </div>

              {/*  Password*/}
              <div className="">
                <label
                  htmlFor="password"
                  className="mb-3 mt-5 block text-xs font-medium"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  name="password"
                  placeholder="Create your password"
                  // required
                />
              </div>
              {/*  Submit button*/}
              <button
                className="w-full rounded-lg border border-gray-500 py-2 font-medium md:text-lg"
                type="submit"
                disabled={isPending}
              >
                Create account
              </button>
            </div>

            {/*Input Errors*/}
            <div className="">
              {state?.message && state.message.length > 0 && (
                <p className="text-center text-sm text-red-600">
                  {state.message}
                </p>
              )}
            </div>
          </div>
        </Form>

        {/*Sign in traditionally*/}
        <p className="flex w-full items-center justify-around py-4 text-sm">
          <span className="">Already have an account?</span>
          <Link href="/sign-in" className="underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
