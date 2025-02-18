"use client";

import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="container mx-auto w-[80%] place-content-center place-items-center py-8 md:w-[70%] md:py-12">
          <div className="w-full items-center space-y-4">
            <h1 className="pt-4 text-xl md:pb-6 md:text-2xl">Welcome back</h1>

            {/* GitHub and Google OAuth */}
            <div className="grid-cols- md:text-l grid gap-6 text-sm lg:grid-cols-2">
              <button className="rounded-lg border border-gray-500 p-2">
                <Link
                  href="/auth/github"
                  className="flex place-items-center justify-center space-x-[6px]"
                >
                  <span>Log in with GitHub</span>
                  <FaGithub className="size-6" />
                </Link>
              </button>

              <button className="rounded-lg border border-gray-500 p-2">
                <Link
                  href="/auth/google"
                  className="flex place-items-center justify-center space-x-[6px]"
                >
                  {" "}
                  <span>Log in with Google</span>{" "}
                  <FcGoogle className="size-6" />
                </Link>
              </button>
            </div>

            <p className="text-l w-full place-items-center overflow-hidden text-center text-gray-500 before:relative before:right-2 before:inline-block before:h-[1px] before:w-2/5 before:bg-gray-500 before:align-middle after:relative after:left-2 after:inline-block after:h-[1px] after:w-2/5 after:bg-gray-500 after:align-middle">
              OR
            </p>

            {/*Log in traditionally*/}
            <Form action={formAction} className=" ">
              <p className="text-l font-medium md:text-lg">Log in with email</p>
              <div className="flex-1 space-y-8 rounded-lg">
                <div className="w-full">
                  {/*Email*/}
                  <div className="">
                    <label
                      htmlFor="email"
                      className="mb-3 mt-5 block text-sm font-medium"
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
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="mb-3 mt-5 block text-sm font-medium"
                      >
                        Password
                      </label>
                      <p className="mt-5 text-xs font-semibold text-blue-500 hover:underline">
                        Forgot password?
                      </p>
                    </div>
                    <input
                      type="password"
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      // required
                    />
                  </div>
                </div>

                {/*  Submit button*/}
                <button
                  className="w-full rounded-lg border border-gray-500 py-2 font-medium md:text-lg"
                  type="submit"
                  disabled={isPending}
                >
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

            {/*Sign up traditionally*/}
            <p className="flex items-center justify-around py-4 text-sm">
              <span className="">Don&lsquo;t have an account?</span>
              <Link href="/sign-up" className="underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/*Image and text content*/}
        <div className="">
          <figure className="relative hidden h-5/6 md:block">
            <Image
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{ objectFit: "cover" }}
              src="/johnny-briggs-unsplash.jpg"
              alt="Up close view of a typewriter focusing on the keys"
              className="aspect-square object-cover"
              priority
            />
          </figure>

          <div className="container mx-auto w-full place-items-center items-center space-y-8 p-8 text-center md:p-12">
            <div className="space-y-2 font-mono">
              <h1 className="text-xl md:text-3xl">Charbage</h1>
              <p className="text-l md:text-lg">Charbage in / Charbage out</p>
            </div>

            <p className="md:text-l font-mono text-sm">
              Experience the modern world of markdown blogging...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
