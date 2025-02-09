"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";

const initialState = { message: "" };

type SignUpProps = {
  action: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

export default function SignUp({ action }: SignUpProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="container mx-auto md:w-[70%] md:p-12 lg:w-[50%] lg:p-16">
      <div className="w-full place-content-center place-items-center p-4">
        <h1 className="mb-3 text-center text-2xl">Create an account</h1>
        <Form action={formAction} className="w-full">
          <div className="flex-1 space-y-4 rounded-lg px-6 pb-4 pt-8">
            <div className="w-full space-y-8">
              {/*Name*/}
              <div className="">
                <label
                  htmlFor="name"
                  className="mb-3 mt-5 block text-xs font-medium"
                >
                  Username
                </label>

                <input
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  name="name"
                  placeholder="Enter your username"
                  // required
                />
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
                  type="email"
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  // required
                />
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
          <Link href="/auth/sign-in" className="underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
