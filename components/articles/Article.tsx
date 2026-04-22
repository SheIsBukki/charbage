"use client";

import { useState } from "react";
import Image from "next/image";
import { Interweave } from "interweave";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { CiCircleChevDown, CiCircleChevUp, CiSettings } from "react-icons/ci";
import {
  BsFillBookmarkCheckFill,
  BsHeartFill,
  BsThreeDots,
  BsThreeDotsVertical,
} from "react-icons/bs";

import md from "@/utils/md";
import {
  copyCurrentUrl,
  getReadingTime,
  getRelativeTime,
} from "@/utils/helpers";
import { DbActionType, PostType, ReactionsType } from "@/lib/types";
import { removeBookmark, removeLike } from "@/db/queries/delete";
import { addBookmark, addLike } from "@/db/queries/insert";
import { Bookmark, Like } from "@/db/schema";
import ArticleSettings from "@/components/articles/ArticleSettings";
import ReaderInteraction from "@/app/ui/ReaderInteraction";
import AuthenticationDialogue from "@/components/auth/AuthenticationDialogue";
import Avatar from "@/app/ui/Avatar";
import { useDisableScroll } from "@/app/ui/useDisableScroll";
import { FaShare } from "react-icons/fa";
import SocialShare from "@/app/ui/SocialShare";

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

  const [expandMore, setExpandMore] = useState(false);
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const [showAuthenticationDialogue, setShowAuthenticationDialogue] =
    useState(false);

  const likeCount = reactions?.likes.length;
  const commentCount = reactions?.comments.length;
  const bookmarkCount = reactions?.bookmarks.length;
  const fullName =
    `${post.authorFirstname || ""} ${post.authorLastname || ""}`.trim();

  const currentUserLiked = reactions?.likes.some(
    (like: Like) => like.userId === currentUser,
  );
  const currentUserbookmarked = reactions?.bookmarks.some(
    (bookmark: Bookmark) => bookmark.userId === currentUser,
  );

  useDisableScroll(expandMore);

  return (
    <>
      <div className="container relative mx-auto lg:grid lg:grid-cols-8 lg:gap-x-8">
        {/*ARTICLE*/}
        <div className="px-6 lg:order-2 lg:col-span-6 lg:pe-16">
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
                <Avatar
                  avatarUrl={post.authorAvatar || ""}
                  alt="Author's avatar"
                  defaultSize={12}
                  mdToLgSize={14}
                />
              </Link>
              <div className="text-sm">
                <p className="font-semibold">
                  <Link href={`/@${post.author}`}>
                    {fullName || post.author}
                  </Link>
                </p>

                <p className="flex flex-col space-y-1 dark:text-gray-400">
                  <span className="">
                    {post.updatedAt
                      ? `Updated at: ${getRelativeTime(post.updatedAt)}`
                      : `Published at: ${getRelativeTime(post.createdAt)}`}
                  </span>

                  <span className="text-sm underline underline-offset-4 dark:text-gray-400">
                    {getReadingTime(post.content)} min read
                  </span>
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

          {/*TAGS*/}
          {post.tags && post.tags.length > 0 && (
            <div className="my-4 flex flex-wrap items-center gap-x-2 gap-y-4">
              {post.tags.map(({ id, name, slug }) => (
                <Link href={`/tag/${slug}`} key={id}>
                  <span className="rounded-full bg-gray-200 px-4 py-2 text-xs dark:bg-gray-500">
                    {name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/*INTERACTIONS AND SETTINGS*/}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t-2 bg-white lg:static lg:bottom-auto lg:z-auto lg:order-1 lg:col-span-1 lg:flex lg:flex-col lg:items-center lg:space-y-4 lg:border-r-2 lg:border-t-0 lg:bg-inherit lg:pt-12 dark:bg-[#0a0a0a] lg:dark:bg-inherit">
          <div className="mt-8 flex justify-between px-4 lg:mt-0 lg:block">
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
                onClick={async () => {
                  if (currentUser === undefined) {
                    setShowAuthenticationDialogue(true);
                    return;
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
                    return;
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
              {/*SOCIAL SHARE BUTTON*/}
              <button
                title="Share button"
                onClick={() => setOpenShareMenu(!openShareMenu)}
                type="button"
              >
                <FaShare />
              </button>
            </div>

            {authorisedPostAuthor && (
              <button
                type="button"
                title="Settings"
                onClick={() => setExpandMore(!expandMore)}
                className="lg:mt-12"
              >
                {expandMore ? (
                  <CiCircleChevUp className="hidden text-3xl lg:block" />
                ) : (
                  <CiCircleChevDown className="hidden text-3xl lg:block" />
                )}
                <BsThreeDotsVertical className="text-2xl lg:hidden" />
              </button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between lg:static lg:flex-col lg:space-x-0 lg:space-y-4">
            {expandMore && authorisedPostAuthor && (
              <div className="h[calc(100dvh/2)] bordr-red-500 absolute bottom-[6rem] right-1 z-30 block items-center space-y-6 rounded-md border-2 bg-white p-1 lg:static lg:bottom-auto lg:right-auto lg:z-auto lg:flex lg:h-auto lg:flex-col lg:border-0 lg:bg-inherit lg:p-0 dark:bg-[#0a0a0a] lg:dark:bg-inherit">
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
          <SocialShare
            openShareMenu={openShareMenu}
            slug={post.slug || ""}
            shortText={post.description || ""}
            postOrProfile="post"
          />
        </div>
      </div>
      <AuthenticationDialogue
        setShowAuthenticationDialogue={setShowAuthenticationDialogue}
        showDialogue={showAuthenticationDialogue}
      />
    </>
  );
}
