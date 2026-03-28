"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GiCabbage } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { FcMenu } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { clsx } from "clsx";
import ThemeSwitcher from "@/app/ui/ThemeSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/db/schema";
import { logoutUser } from "@/app/actions/auth";
import { getPreviousPath } from "@/utils/helpers";

type MainNavProps = { user: Omit<User, "password"> | null };

export default function MainNav({ user }: MainNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    getPreviousPath(pathname);
  }, [pathname]);

  return (
    <nav className="flex items-center justify-between px-4 py-4 shadow md:px-8">
      <div className="flex justify-center space-x-2 md:space-x-4">
        <Link href="/">
          {/*Replace Home and cabbage icon below with the app logo*/}
          <span className="hidden md:block">Home</span>
          <GiCabbage className="size-6 rounded-full border md:hidden" />
        </Link>
        {!pathname.startsWith("/write") && (
          <button
            type="button"
            onClick={() =>
              user ? router.push("/write") : router.replace("/sign-in")
            }
          >
            <span className="hidden md:block">Write</span>
            <CiEdit className="size-6 md:hidden" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between space-x-2 md:space-x-4">
        {/*Hamburger Menu*/}
        <button
          aria-expanded={open}
          type="button"
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          className="md:hidden"
        >
          {open ? (
            <MdClose
              className={`size-6 md:hidden ${open && "absolute z-50"}`}
            />
          ) : (
            <FcMenu className="size-6" />
          )}
          <span className="sr-only">Open and close menu</span>
        </button>

        {/*Mobile nav*/}
        <div
          className={clsx(
            "fixed bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-end bg-white pr-4 pt-14 transition-transform duration-300 ease-in-out motion-reduce:transition-none md:hidden dark:bg-[#0a0a0a]",
            open ? "translate-x-0" : "translate-x-[100%]",
          )}
        >
          {/*I probably don't need this button defined explicitly here after all*/}
          {/*<button
            aria-expanded={open}
            onClick={() => setOpen(false)}
            type="button"
            className="fixed right-4 top-4 mb-4 block p-2 text-3xl md:hidden"
          >
            <MdClose className="size-6 animate-bounce md:hidden" />
            <span className="sr-only">Close menu</span>
          </button>*/}

          <ul className="container mx-auto my-8 grid place-content-center place-items-center items-center gap-8 p-8 text-lg">
            <li onClick={() => setOpen(false)} className="">
              {user ? (
                <button
                  type="button"
                  onClick={async (event) => {
                    event.preventDefault();
                    await logoutUser();
                    router.refresh();
                  }}
                >
                  Log out
                </button>
              ) : (
                !pathname.startsWith("/sign-in") && (
                  <Link href="/sign-in">Log in</Link>
                )
              )}
            </li>
            {!user && !pathname.startsWith("/sign-up") && (
              <li onClick={() => setOpen(false)} className="">
                <Link href="/sign-up">Sign up</Link>
              </li>
            )}
            <li onClick={() => setOpen(false)} className="">
              <Link href="/write">Write</Link>
            </li>
            <li onClick={() => setOpen(false)} className="">
              Menu Item 3
            </li>
          </ul>
        </div>

        {/*Desktop Nav*/}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="">Hi, {user.username}</span>
              <button
                type="button"
                onClick={async (event) => {
                  event.preventDefault();
                  await logoutUser();
                  router.refresh();
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            !pathname.startsWith("/sign-in") && (
              <Link href="/sign-in">Log in</Link>
            )
          )}
        </div>

        <ThemeSwitcher />
      </div>
    </nav>
  );
}
