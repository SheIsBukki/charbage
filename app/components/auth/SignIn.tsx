"use client";

import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";

const initialState = { message: "" };

type SignInProps = {
  action: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

export default function SignIn({ action }: SignInProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <>
      {/*Log in traditionally*/}
      <Form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl">Please log in to continue.</h1>

          <div className="w-full">
            {/*Email*/}
            <div className="">
              <label
                htmlFor="email"
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              >
                Email
              </label>

              <input
                type="email"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                name="password"
                placeholder="Enter your password"
                // required
              />
            </div>
          </div>

          {/*  Submit button*/}
          <button className="" type="submit" disabled={isPending}>
            Log in
          </button>

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

      {/* GitHub and Google OAuth */}
      <div>
        <Link href="/auth/github">Sign in with GitHub</Link>
        <Link href="/auth/google">Sign in with Google</Link>
      </div>

      {/*Sign up traditionally*/}
      <div className="">
        <p className="">
          <Link href="/auth/sign-up">Or Sign Up</Link>
        </p>
      </div>
    </>
  );
}
