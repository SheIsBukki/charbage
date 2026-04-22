"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Interweave } from "interweave";
import "highlight.js/styles/shades-of-purple.css";
import { BsBookmark } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { TfiCommentAlt } from "react-icons/tfi";

import {
  createExcerpt,
  getReadingTime,
  getRelativeTime,
} from "@/utils/helpers";
import { PostType } from "@/lib/types";
import Avatar from "@/app/ui/Avatar";

export default function ArticleCard({ article }: { article: PostType }) {
  const pathname = usePathname();
  const fullName =
    `${article.authorFirstname || ""} ${article.authorLastname || ""}`.trim();

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
              <p className="text-xs md:text-sm dark:text-gray-400">
                {" "}
                {article.updatedAt ? "Updated" : "Published"}:{" "}
                {getRelativeTime(
                  article.updatedAt ? article.updatedAt : article.createdAt,
                )}
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
      <div className="itemscenter justifybetween boder flex flex-col space-y-2 border-b pb-6 pt-4 text-xs md:text-sm lg:border-0 lg:pb-0 dark:text-gray-300">
        {/*Tags*/}
        {article.tags && article.tags.length > 0 && (
          <div className="flex space-x-1 md:space-x-2">
            {article.tags.map((tag) => (
              <span key={tag.id} className="">
                <Link href={`/tag/${tag.slug}`} className="">
                  #{tag.name}
                </Link>
              </span>
            ))}
          </div>
        )}

        {/*INTERACTION AND READING TIME*/}
        <div className="flex justify-between">
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
          <p className="">{getReadingTime(article.content)} min read</p>
        </div>
      </div>
    </div>
  );
}
