"use client";

import Image from "next/image";
import { Interweave } from "interweave";
import "highlight.js/styles/shades-of-purple.css";
import { BsBookmark } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { TfiCommentAlt } from "react-icons/tfi";

import md from "@/utils/md";
import { regularDate } from "@/utils/helpers";
import { ArticlesType } from "@/app/page";

export default function ArticleCard({ articlesData }: any) {
  const { posts } = articlesData;
  const latestArticles: ArticlesType = posts;
  return (
    <div className="">
      {latestArticles &&
        latestArticles.map((article) => (
          <div
            key={article.id}
            className="space-y-2 px-8 py-3 md:px-4 lg:my-6 lg:rounded-lg lg:border"
          >
            {/*Author and publication info*/}
            <div className="">
              <div className="flex items-center space-x-4">
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
                <div className="text-sm">
                  <p className="font-semibold">{article.author}</p>
                  <p className="dark:text-gray-400">
                    {" "}
                    {regularDate(article.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/*Title, Post excerpt and featured image*/}
            <div
              className={`${
                article.featuredImage
                  ? "grid-cols-6 items-center gap-8 md:grid"
                  : "md:flex"
              } space-y-2 sm:block`}
            >
              <div className="col-span-4">
                {/*Title*/}
                <h1 className="mb-1 font-bold md:text-xl">{article.title}</h1>

                <Interweave
                  className="line-clamp-3 dark:text-gray-400"
                  // content={createExcerpt(post.content)}
                  content={md.render(article.content)}
                />
              </div>

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
                  <span className="">6</span>
                  <span className="hidden md:inline-block">likes</span>
                  <BiLike className="inline-block md:hidden md:size-4" />
                </span>

                <span className="inline-flex items-center space-x-1">
                  <span className="">4</span>
                  <span className="hidden md:inline-block">comments</span>
                  <TfiCommentAlt className="inline-block md:hidden md:size-4" />
                </span>

                <BsBookmark className="md:size-4" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

/**
 * I need to create a logic to check if the post.updatedAt is more recent

                <span className="">
                  Last updated: {regularDate(post.updatedAt)}
                </span>
 * */
