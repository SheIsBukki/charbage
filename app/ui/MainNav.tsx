"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GiCabbage } from "react-icons/gi";
import { CiEdit, CiSettings } from "react-icons/ci";
import { FcMenu } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { LuBell } from "react-icons/lu";
import { clsx } from "clsx";
import ThemeSwitcher from "@/app/ui/ThemeSwitcher";
import { Profile, User } from "@/db/schema";
import { logoutUser } from "@/app/actions/auth";
import { getPreviousPath } from "@/utils/helpers";
import Avatar from "@/app/ui/Avatar";
import { useDisableScroll } from "@/app/ui/useDisableScroll";
import WholisticSearch from "@/app/ui/WholisticSearch";

type MainNavProps = {
  user: Omit<User, "password"> | null;
  profile: Profile | undefined;
};

export default function MainNav({ user, profile }: MainNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    getPreviousPath(pathname);
    setOpen(false);
  }, [pathname]);

  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();

  useDisableScroll(open);

  return (
    <div className="w-full">
      <div className="brder flex items-center justify-between gap-x-8 border-red-500 bg-gray-50 px-4 py-4 shadow md:px-8 lg:gap-x-24 dark:bg-gray-950">
        <div className="boder flex items-center justify-center space-x-2 border-red-500 md:space-x-6">
          <Link href="/">
            {/*Replace Home and cabbage icon below with the app logo*/}
            <span className="hidden text-2xl font-bold text-purple-500 md:block">
              Charbage
            </span>
            <GiCabbage className="size-6 rounded-full border md:hidden" />
          </Link>
          {!pathname.startsWith("/write") && (
            <Link
              className="flex items-center space-x-2"
              href={user ? "/write" : "/sign-in"}
            >
              <CiEdit className="size-6" />
              <span className="hidden md:block">Write</span>
            </Link>
          )}
        </div>

        {/*SEARCH*/}
        <WholisticSearch />

        <div className="brder flex items-center justify-between gap-x-2 border-blue-500 md:gap-x-4 lg:gap-x-8">
          {/*Hamburger Menu for Mobile nav*/}
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

          {/*NOTIfiCATIONS*/}
          {user && (
            <div className="hidden md:block">
              <LuBell className="hidden text-2xl font-thin md:block" />
            </div>
          )}
          {/*Desktop Nav*/}
          <div className="hidden md:block">
            {user ? (
              <div
                className=""
                onClick={() => (open ? setOpen(false) : setOpen(true))}
              >
                <Avatar
                  avatarUrl={profile?.avatar || ""}
                  alt="Profile avatar"
                  defaultSize={8}
                  mdToLgSize={8}
                />
                <span className="sr-only">Open and close menu</span>
              </div>
            ) : (
              !pathname.startsWith("/sign-in") && (
                <Link href="/sign-in">Log in</Link>
              )
            )}
          </div>

          <ThemeSwitcher />
        </div>
      </div>

      {/*MENU ITEMS*/}
      <div
        className={clsx(
          "brder-red-500 fixed bottom-0 left-0 right-0 top-0 z-40 flex flex-col items-end rounded-lg border-2 bg-white pr-4 pt-8 shadow-2xl drop-shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none md:bottom-auto md:left-auto md:top-16 md:max-h-[100%] md:overflow-auto md:py-4 dark:bg-[#0a0a0a]",
          open ? "translate-x-0" : "translate-x-[100%]",
        )}
      >
        <ul className="container mx-auto my-8 grid place-content-start place-items-start items-center gap-8 p-8 text-lg">
          {profile && (
            <li onClick={() => setOpen(false)} className="">
              <Link
                href={`/${profile.slug}`}
                className="flex w-full items-center space-x-3"
              >
                <figure className="size-12 rounded-full ring-2">
                  <img
                    src={
                      `${profile.avatar}` || "/avatar-default-svgrepo-com.svg"
                    }
                    alt="Profile avatar"
                    className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)]"
                  />
                </figure>
                <p className="flex flex-col">
                  <span>{fullName || user?.username}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    View profile
                  </span>
                </p>
              </Link>
            </li>
          )}
          {!pathname.startsWith("/write") && (
            <li onClick={() => setOpen(false)} className="">
              <Link
                href={user ? "/write" : "/sign-in"}
                className="flex items-center space-x-3"
              >
                <CiEdit className="size-6" />
                <span className="">Write</span>
              </Link>
            </li>
          )}
          <li onClick={() => setOpen(false)} className="">
            <Link className="flex items-center space-x-3" href="#">
              <LuBell className="size-6" />
              <span className="">Notifications</span>
            </Link>
          </li>
          {user && pathname !== "/settings" && (
            <li
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3"
            >
              <CiSettings className="size-6" />
              <Link href="/settings">Settings</Link>
            </li>
          )}
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
        </ul>
      </div>
    </div>
  );
}
