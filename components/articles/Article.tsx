"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Interweave } from "interweave";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import md from "@/utils/md";
import { copyCurrentUrl, regularDate } from "@/utils/helpers";
import { DbActionType, PostType, ReactionsType } from "@/lib/types";
import { removeBookmark, removeLike } from "@/db/queries/delete";
import { addBookmark, addLike } from "@/db/queries/insert";
import { Bookmark, Like } from "@/db/schema";

import ArticleSettings from "@/components/articles/ArticleSettings";
import ReaderInteraction from "@/app/ui/ReaderInteraction";

import { MdOutlineAddLink, MdOutlineBookmarkAdd } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { CiCircleChevDown, CiCircleChevUp, CiSettings } from "react-icons/ci";
import { BsFillBookmarkCheckFill, BsHeartFill } from "react-icons/bs";
import AuthenticationDialogue from "@/components/auth/AuthenticationDialogue";
import Link from "next/link";

// export const dynamic = "force-dynamic";

export default function Article({
  post,
  deletePostAction,
  authorisedPostAuthor,
  reactions,
  currentUser,
}: {
  post: PostType;
  deletePostAction: DbActionType;
  authorisedPostAuthor: boolean;
  reactions: ReactionsType;
  currentUser: string | undefined;
}) {
  const router = useRouter();

  const [copyUrl, setCopyUrl] = useState(false);
  const [expandMore, setExpandMore] = useState(false);
  const [showAuthenticationDialogue, setShowAuthenticationDialogue] =
    useState(false);

  const likeCount = reactions?.likes.length;
  const commentCount = reactions?.comments.length;
  const bookmarkCount = reactions?.bookmarks.length;

  useEffect(() => {
    if (copyUrl) {
      copyCurrentUrl().then((r) => console.log(r));
    }

    const timeoutId = setTimeout(() => setCopyUrl(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [copyUrl]);

  const currentUserLiked = reactions?.likes.some(
    (like: Like) => like.userId === currentUser,
  );
  const currentUserbookmarked = reactions?.bookmarks.some(
    (bookmark: Bookmark) => bookmark.userId === currentUser,
  );

  return (
    <>
      <div className="brder-2 container relative mx-auto border-red-500 lg:grid lg:grid-cols-8 lg:gap-x-8">
        {/*ARTICLE*/}
        <div className="boder-2 border-red-500 px-6 lg:order-2 lg:col-span-6 lg:pe-16">
          <div className="mb-8 flex flex-col space-y-8">
            {/*Title*/}
            <h1 className="text-2xl font-bold md:text-5xl">{post.title}</h1>
            {/*Featured image*/}
            {post.featuredImage && (
              <div className="size-full rounded-lg">
                <figure className="relative h-full w-full">
                  <Image
                    width={0}
                    height={0}
                    alt="featured image"
                    src={post.featuredImage}
                    sizes="(min-width: 808px) 50vw, 100vw"
                    className="aspect-auto size-full rounded-lg object-cover"
                  />
                </figure>
              </div>
            )}
            {/*Post and author data*/}
            <div className="flex items-center space-x-4">
              <Link href={`/@${post.author}`}>
                <figure className="">
                  <Image
                    sizes="(min-width: 808px) 50vw, 100vw"
                    width={0}
                    height={0}
                    src="/"
                    alt="author avatar"
                    className="size-[40] rounded-full bg-gray-500"
                  />
                </figure>
              </Link>
              <div className="text-sm">
                <p className="font-semibold">
                  <Link href={`/@${post.author}`}>{post.author}</Link>
                </p>
                <p className="dark:text-gray-400">
                  {post.updatedAt
                    ? `Updated at: ${regularDate(post.updatedAt)}`
                    : `Published at: ${regularDate(post.createdAt)}`}
                </p>
              </div>
            </div>
          </div>

          {/*Post content*/}
          <article className="">
            <Interweave
              className="leading-relaxed dark:text-gray-400"
              content={md.render(post.content)}
            />
          </article>

          {/*STATIC TAGS*/}
          <div className="boder-2 my-4 flex flex-wrap gap-2 border-red-500">
            {["Static", "Tags", "Until", "Dynamic", "Tags"].map(
              (tag, index) => (
                <span
                  className="rounded-full bg-gray-200 px-4 py-2 text-[0.75em] dark:bg-gray-500"
                  key={`${tag}-${index}`}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        {/*INTERACTIONS AND SETTINGS*/}
        <div className="boder-red-500 fixed bottom-0 z-20 w-full border-t-2 bg-white lg:static lg:bottom-auto lg:z-auto lg:order-1 lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:space-y-4 lg:border-r-2 lg:border-t-0 lg:bg-inherit lg:pt-12 dark:bg-[#0a0a0a] lg:dark:bg-inherit">
          <div className="brder mt-8 flex justify-between border-red-500 px-4 lg:mt-0 lg:block">
            <div className="flex items-center space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
              <a href="#responses" className="">
                <ReaderInteraction
                  icon={<BiCommentDetail />}
                  interactionCount={commentCount}
                  title="Comment"
                />
              </a>
              <button
                name="likeButton"
                onClick={async (event) => {
                  if (currentUser === undefined) {
                    setShowAuthenticationDialogue(true);
                  }

                  if (currentUserLiked) {
                    await removeLike(post.id, currentUser || "");
                  } else {
                    await addLike(post.id, currentUser || "");
                  }
                  router.refresh();
                }}
                type="button"
                className="hover:scale-125"
              >
                <ReaderInteraction
                  icon={
                    <BsHeartFill
                      className={
                        currentUserLiked ? "fill-red-500" : "fill-red-200"
                      }
                    />
                  }
                  title="Like"
                  interactionCount={likeCount}
                />
              </button>
              <button
                name="bookmarkButton"
                onClick={async () => {
                  if (currentUser === undefined) {
                    setShowAuthenticationDialogue(true);
                  }

                  if (currentUserbookmarked) {
                    await removeBookmark(post.id, currentUser || "");
                  } else {
                    await addBookmark(post.id, currentUser || "");
                  }

                  router.refresh();
                }}
                type="button"
                className="hover:scale-125"
              >
                <ReaderInteraction
                  icon={
                    currentUserbookmarked ? (
                      <BsFillBookmarkCheckFill className="fill-purple-500" />
                    ) : (
                      <MdOutlineBookmarkAdd />
                    )
                  }
                  title="Bookmark"
                  interactionCount={bookmarkCount}
                />
              </button>
              <div
                title="Copy link"
                onClick={() => setCopyUrl(true)}
                className="items-center lg:my-4"
              >
                <MdOutlineAddLink
                  className={clsx(
                    "text-2xl hover:scale-125",
                    copyUrl && "text-purple-500",
                  )}
                />
              </div>
            </div>

            {authorisedPostAuthor && (
              <button
                type="button"
                title="Settings"
                onClick={() => setExpandMore(!expandMore)}
                className="bordr-2 border-red-500 lg:mt-12"
              >
                {window !== undefined && window.outerWidth >= 1024 ? (
                  expandMore ? (
                    <CiCircleChevUp className="hidden text-3xl lg:block" />
                  ) : (
                    <CiCircleChevDown className="hidden text-3xl lg:block" />
                  )
                ) : (
                  <CiSettings className={`text-3xl lg:hidden`} />
                )}
              </button>
            )}
          </div>

          <div className="brder-2 mt-8 flex items-center justify-between border-red-500 lg:static lg:flex-col lg:space-x-0 lg:space-y-4">
            {expandMore && authorisedPostAuthor && (
              <div className="borer-red-500 brder-b-0 absolute bottom-[6rem] z-30 block h-[calc(100dvh/2)] w-full items-center space-y-6 border-2 bg-white p-4 md:p-8 lg:static lg:bottom-auto lg:z-auto lg:flex lg:h-auto lg:flex-col lg:border-0 lg:bg-inherit lg:p-0 dark:bg-[#0a0a0a] lg:dark:bg-inherit">
                <ArticleSettings
                  postId={post.id}
                  authorId={post.userId}
                  postSlug={post.slug}
                  featuredImage={post?.featuredImage}
                  deletePostAction={deletePostAction}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthenticationDialogue
        setShowAuthenticationDialogue={setShowAuthenticationDialogue}
        showDialogue={showAuthenticationDialogue}
      />
    </>
  );
}
