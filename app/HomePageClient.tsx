"use client";

import Link from "next/link";
import { useState } from "react";
import { clsx } from "clsx";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { LuBell } from "react-icons/lu";
import { IoBookmarksOutline, IoStatsChartOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { SlUserFollowing } from "react-icons/sl";
import PopularTopics from "@/components/home/PopularTopics";
import PaginationWrapper from "@/app/ui/PaginationWrapper";
import { getLatestPosts, getUserBookmarks } from "@/db/queries/select";
import { PostType, UserBookmarksType } from "@/lib/types";
import ReadingListCard from "@/components/home/ReadingListCard";
import PaginatedArticleCards from "@/components/articles/PaginatedArticleCards";
import { useDisableScroll } from "@/app/ui/useDisableScroll";
import SmViewportPanel from "@/components/home/SmViewportPanel";
import NoUserContent from "@/app/ui/NoUserContent";

export default function HomePageClient({
  currentUserBookmarks,
  posts,
  currentUserId,
}: {
  posts: PostType[];
  currentUserBookmarks: UserBookmarksType[];
  currentUserId?: string;
}) {
  const [bookmarkArr, setBookmarkArr] =
    useState<UserBookmarksType[]>(currentUserBookmarks);

  const [smBottomPanel, setSmBottomPanel] = useState("");

  useDisableScroll(!!smBottomPanel);

  // console.log(bookmarkArr);
  // THESE ARE PLACEHOLDERS. THEY ARE FILLERS
  const placeholderItems = [
    // { text: "Charbage", icon: <GiCabbage className="text-lg" /> },
    // { text: "Blogs", icon: <BsFolderCheck className="text-lg" /> },
    // { text: "Search", icon: <CiSearch className="text-2xl" /> },
    // { text: "Notifications", icon: <LuBell className="text-2xl" /> },
    // { text: "Write", icon: <TfiWrite className="text-2xl" /> },
    { text: "Following", icon: <SlUserFollowing className="text-2xl" /> },
    { text: "Bookmarks", icon: <IoBookmarksOutline className="text-2xl" /> },
    { text: "Stats", icon: <IoStatsChartOutline className="text-2xl" /> },
    { text: "Drafts", icon: <MdOutlineLibraryBooks className="text-2xl" /> },
  ];
  return (
    <div
      className={clsx(
        "brder container relative mx-auto mb-20 mt-5 h-full border-red-500 md:my-10 md:grid md:grid-cols-6 lg:grid-cols-8",
      )}
    >
      {/*Other stuff like Reading List, User Suggestion, etc*/}
      {/*JUST SOME iTEMS*/}
      <div
        className={clsx(
          "boder-red-500 space-y-6 md:fixed md:bottom-0 md:left-[1rem] md:top-24 md:col-span-2 md:col-start-1 md:block md:h-screen md:max-h-[100%] md:w-[calc(((100%/6)*2)-2rem)] md:overflow-auto md:border-r md:pb-24 md:pr-4 lg:left-[2rem] lg:w-[calc(((100%/8)*2)-2rem)] lg:pr-6 xl:w-[calc(((100%/8)*2)-3rem)] xl:pr-12",
        )}
      >
        {/*Personal Homepage Menu*/}
        <div
          className={clsx(
            "boder space-y-4 border-red-500 md:block",
            smBottomPanel === "Menu"
              ? "fixed bottom-16 top-[30vh] z-30 block w-full bg-gray-50 p-4 md:hidden dark:bg-gray-950"
              : "hidden",
          )}
        >
          <p className="flex w-full items-center space-x-4 md:hidden">
            <span className="">
              <CiSearch className="text-2xl" />
            </span>
            <span className="">Search</span>
          </p>
          <p className="flex w-full items-center space-x-4 md:hidden">
            <span className="">
              <LuBell className="text-2xl" />
            </span>
            <span className="">Notifications</span>
          </p>
          {placeholderItems.map(({ text, icon }) => (
            <p key={text} className="flex w-full items-center space-x-4">
              <span className="">{icon}</span>
              <span className="">{text}</span>
            </p>
          ))}
        </div>

        <hr className="hidden md:block" />
        {/*READING LIST*/}
        <div
          className={clsx(
            "boder space-y-6 border-red-500 md:bottom-12 md:block md:max-h-[70%] md:overflow-auto md:pb-12",
            smBottomPanel === "Library"
              ? "fixed bottom-16 top-[calc(30vh-1.5rem)] z-30 block max-h-[100%] w-full overflow-auto bg-gray-50 p-4 md:hidden dark:bg-gray-950"
              : "hidden",
          )}
        >
          <p className="text-lg font-semibold">Your Reading list</p>
          {bookmarkArr.length ? (
            <PaginationWrapper
              setMoreDataAction={setBookmarkArr}
              id={currentUserId}
              jump={false}
              fetcherAndKind={{
                kind: "currentUserBookmarks",
                fetcher: getUserBookmarks,
              }}
            >
              <div className="space-y-6">
                {bookmarkArr.map(
                  ({
                    bookmarkId,
                    authorAvatar,
                    authorSlug,
                    authorFirstname,
                    authorLastname,
                    authorUsername,
                    ...data
                  }) => (
                    <ReadingListCard
                      key={bookmarkId}
                      authorSlug={authorSlug || ""}
                      authorAvatar={authorAvatar || ""}
                      authorName={
                        `${authorFirstname || ""} ${authorLastname || ""}`.trim() ||
                        authorUsername ||
                        ""
                      }
                      {...data}
                    />
                  ),
                )}
              </div>
            </PaginationWrapper>
          ) : (
            <NoUserContent content="bookmarks" />
          )}
        </div>
      </div>

      {/*Article Cards*/}
      <div
        className={clsx(
          "boder relative border-red-500 md:col-span-4 md:col-start-3 md:mx-[-1rem] lg:mx-[1rem] xl:mx-[3rem] 2xl:mx-[4rem]",
        )}
      >
        <p className="boder sticky top-16 z-30 mb-12 hidden w-full border-red-500 bg-white py-4 font-medium underline decoration-1 underline-offset-[1.3rem] lg:block dark:bg-[#0a0a0a]">
          Newest
        </p>
        <PaginatedArticleCards
          posts={posts}
          fetcherAndKind={{
            kind: "homepagePosts",
            fetcher: getLatestPosts,
          }}
        />
      </div>

      {/*READING LIST ETC...*/}
      <div
        className={clsx(
          "bordr-red-500 space-y-6 lg:fixed lg:bottom-0 lg:right-[2rem] lg:top-24 lg:col-span-2 lg:col-start-7 lg:block lg:max-h-[100%] lg:w-[calc(((100%/8)*2)-2rem)] lg:overflow-auto lg:border-l lg:pb-24 lg:pl-6 xl:w-[calc(((100%/8)*2)-3rem)] xl:pl-12",
        )}
      >
        {/*FEATURED POSTS — NOTE THIS IS NOT DYNAMIC, THIS IS READING THE SAME POSTS DATA BUT IN REVERSE*/}
        <div
          className={clsx(
            "boder space-y-6 border-red-500 lg:block",
            smBottomPanel === "Featured"
              ? "fixed bottom-16 top-[30vh] z-30 block max-h-[100%] w-full overflow-auto bg-gray-50 p-4 pb-16 md:hidden dark:bg-gray-950"
              : "hidden",
          )}
        >
          <p className="text-lg font-semibold">Featured posts</p>
          {posts
            .slice(0, 3)
            .map(
              ({
                id: postId,
                authorAvatar,
                slug: postSlug,
                authorFirstname,
                authorLastname,
                author,
                ...data
              }) => (
                <ReadingListCard
                  key={postId}
                  postSlug={postSlug || ""}
                  authorSlug={`@/${author}` || ""}
                  authorAvatar={authorAvatar || ""}
                  authorName={
                    `${authorFirstname || ""} ${authorLastname || ""}`.trim() ||
                    author ||
                    ""
                  }
                  {...data}
                />
              ),
            )}

          <p className="text-gray-600 dark:text-gray-400">
            <Link href="#">See full list</Link>
          </p>
        </div>

        <hr className="" />
        {/*POPULAR TOPICS AKA TAGS*/}
        <div
          className={clsx(
            "boder brder-red-500 space-y-6 lg:block",
            smBottomPanel === "Topics"
              ? "fixed bottom-16 top-[calc(30vh-1.5rem)] z-30 block max-h-[100%] w-full overflow-auto rounded-lg border-2 bg-gray-50 p-4 pb-16 md:hidden dark:bg-gray-950"
              : "hidden",
          )}
        >
          <p className="text-lg font-semibold">Popular topics</p>
          <PopularTopics />
          <p className="text-gray-600 dark:text-gray-400">
            <Link href="#">See more topics</Link>
          </p>
        </div>
      </div>

      {/*  SM MENU*/}
      <SmViewportPanel
        smBottomPanel={smBottomPanel}
        setSmBottomPanel={setSmBottomPanel}
      />
    </div>
  );
}
