"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { IoBookmarksOutline, IoSettingsOutline } from "react-icons/io5";
import { LuBell, LuLayoutDashboard } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { GiCabbage } from "react-icons/gi";
import { clsx } from "clsx";
import { Profile } from "@/db/schema";
import { useDisableScroll } from "@/app/ui/useDisableScroll";

export default function ProfileSideBar({
  currentUserProfile,
  setOpenAction,
  openAction,
}: {
  currentUserProfile: Profile;
  setOpenAction: Dispatch<SetStateAction<boolean>>;
  openAction: boolean;
}) {
  const fullName =
    `${currentUserProfile.firstName || ""} ${currentUserProfile.lastName || ""}`.trim();

  // THESE ARE PLACEHOLDERS. THEY ARE FILLERS
  const sidebarItems = [
    // { text: "Charbage", icon: <GiCabbage className="text-lg" /> },
    // { text: "Blogs", icon: <BsFolderCheck className="text-lg" /> },
    { text: "Notifications", icon: <LuBell className="text-lg" /> },
    { text: "Write", icon: <TfiWrite className="text-lg" /> },
    { text: "Bookmarks", icon: <IoBookmarksOutline className="text-lg" /> },
    { text: "Dashboard", icon: <LuLayoutDashboard className="text-lg" /> },
    { text: "Drafts", icon: <MdOutlineLibraryBooks className="text-lg" /> },
  ];

  useDisableScroll(openAction);

  return (
    <div
      className={clsx(
        "borer-red-500 fixed bottom-0 left-0 top-[3.5rem] flex flex-col justify-between space-y-6 border-r-2 py-6 transition-transform duration-300 ease-in motion-reduce:transition-none md:h-[calc(100vh-5rem)]",
        !openAction
          ? "w-[16%] translate-x-[-1%] items-center md:w-[8%] lg:w-[4%]"
          : "z-30 w-[80%] bg-gray-50 px-4 md:z-auto md:w-[28%] md:bg-transparent md:px-[10rem_10rem] lg:w-[14%] dark:bg-gray-950",
      )}
    >
      <div className="flex flex-col space-y-5">
        <div
          className={clsx(
            "boder w-full border-red-500",
            !openAction
              ? "flex w-full flex-col items-center space-y-6"
              : "flex w-full flex-row-reverse items-center justify-between",
          )}
        >
          <button
            type="button"
            onClick={() => setOpenAction(!openAction)}
            className=""
          >
            {!openAction ? (
              <RxDoubleArrowRight className="text-xl" />
            ) : (
              <RxDoubleArrowLeft className="text-xl" />
            )}
          </button>
          <p
            className={clsx(
              "flex items-center space-x-2",
              !openAction && "mb-4",
            )}
          >
            <span className="flex">
              {/*<GiCabbage className="text-lg" />*/}
              <FaHome />
            </span>
            <span
              className={clsx(
                "font-semibold",
                !openAction ? "hidden" : "block",
              )}
            >
              Home
              {/*Charbage*/}
            </span>
          </p>
        </div>

        {sidebarItems.map(({ text, icon }) => (
          <p key={text} className="flex w-full items-center space-x-2 text-sm">
            <span className="">{icon}</span>
            <span
              className={clsx(
                "brder border-red-500",
                !openAction ? "hidden" : "block",
              )}
            >
              {text}
            </span>
          </p>
        ))}
      </div>
      <div className="boder flex flex-col space-y-4 border-red-500">
        <Link
          href={`/${currentUserProfile.slug}`}
          className="flex w-full items-center space-x-2 text-sm"
        >
          <figure className="size-4 space-y-4 rounded-full ring-2">
            <img
              src={
                `${currentUserProfile.avatar}` ||
                "/avatar-default-svgrepo-com.svg"
              }
              alt="Profile avatar"
              className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)]"
            />
          </figure>
          <span
            className={clsx(
              "borer border-red-500",
              !openAction ? "hidden" : "block",
            )}
          >
            {fullName || currentUserProfile.slug}
          </span>
        </Link>
        <Link
          href="/settings"
          className="flex w-full items-center space-x-2 text-sm"
        >
          <span className="">
            <IoSettingsOutline className={`text-lg`} />
          </span>
          <span
            className={clsx(
              "borer border-red-500",
              !openAction ? "hidden" : "block",
            )}
          >
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
