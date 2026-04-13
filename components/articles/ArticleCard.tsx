"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Interweave } from "interweave";
import "highlight.js/styles/shades-of-purple.css";
import { BsBookmark } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { TfiCommentAlt } from "react-icons/tfi";
import { createExcerpt, regularDate } from "@/utils/helpers";
import { PostType } from "@/lib/types";
import Avatar from "@/app/ui/Avatar";

export default function ArticleCard({ article }: { article: PostType }) {
  const pathname = usePathname();
  const fullName =
    `${article.authorFirstname || ""} ${article.authorLastname || ""}`.trim();

  // console.log(article);
  // console.log(typeof article.comments);

  return (
    <div className="space-y-2 px-8 py-3 md:px-4 lg:my-6 lg:rounded-lg lg:border">
      <div
        className={`${
          article.featuredImage
            ? "grid-cols-6 items-center gap-8 md:grid"
            : "md:flex"
        } space-y-2 sm:block`}
      >
        <div className="col-span-4 space-y-4">
          {/*Title*/}
          <p className="mb-1 font-bold md:text-xl">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </p>

          {/*Author and publication info*/}
          <div className="flex items-center space-x-4">
            {pathname !== `/@${article.author}` && (
              <Link href={`/@${article.author}`}>
                <Avatar
                  avatarUrl={article.authorAvatar || ""}
                  alt="author's avatar"
                  defaultSize={10}
                  mdToLgSize={10}
                />
                {/*<figure className="size-[40] rounded-full bg-gray-500 ring-2">*/}
                {/*  <img*/}
                {/*    width={0}*/}
                {/*    height={0}*/}
                {/*    src={*/}
                {/*      article.authorAvatar || "/avatar-default-svgrepo-com.svg"*/}
                {/*    }*/}
                {/*    alt="author avatar"*/}
                {/*    className="size-[40] rounded-full bg-gray-500"*/}
                {/*  />*/}
                {/*</figure>*/}
              </Link>
            )}
            <div className="text-sm">
              {pathname !== `/@${article.author}` && (
                <p className="font-semibold">
                  <Link href={`/@${article.author}`}>
                    {fullName || article.author}
                  </Link>
                </p>
              )}
              <p className="dark:text-gray-400">
                {" "}
                {regularDate(article.createdAt)}
              </p>
            </div>
          </div>

          {/*EXCERPT*/}
          {article.description ? (
            <p className="dark:text-gray-400">{article.description}</p>
          ) : (
            <div>
              <Interweave
                className="dark:text-gray-400"
                content={createExcerpt(article.content)}
              />
            </div>
          )}
        </div>

        {/*FEATURED IMAGE*/}
        {article.featuredImage && (
          <div className="col-span-2 size-full rounded-lg">
            <figure className="relative h-[150px] w-full">
              <Image
                width={0}
                height={0}
                alt="featured image"
                src={article.featuredImage}
                sizes="(min-width: 808px) 50vw, 100vw"
                className="aspect-auto size-full rounded-lg object-cover"
              />
            </figure>
          </div>
        )}
      </div>

      {/*Tags and Interactions*/}
      <div className="flex items-center justify-between border-b pb-6 text-xs md:text-sm lg:border-0 lg:pb-0 dark:text-gray-300">
        {/*Tags*/}
        <div className="flex space-x-1 md:space-x-2">
          {["REACT", "VUE", "FRONTEND"].map((tag) => (
            <p key={tag} className="">
              #{tag}
            </p>
          ))}
        </div>

        {/*Interactions*/}
        <div className="flex items-center space-x-2.5 md:space-x-4">
          <span className="inline-flex items-center space-x-1">
            <span className="">{article.likes}</span>
            <span className="hidden md:inline-block">likes</span>
            <BiLike className="inline-block md:hidden md:size-4" />
          </span>

          <span className="inline-flex items-center space-x-1">
            <span className="">{article.comments}</span>
            <span className="hidden md:inline-block">comments</span>
            <TfiCommentAlt className="inline-block md:hidden md:size-4" />
          </span>

          <span className="inline-flex items-center space-x-1">
            <span className="">{article.bookmarks}</span>
            <span className="hidden md:inline-block">bookmarks</span>
            <BsBookmark className="inline-block md:hidden md:size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * I need to create a logic to check if the post.updatedAt is more recent

                <span className="">
                  Last updated: {regularDate(post.updatedAt)}
                </span>
 * */
