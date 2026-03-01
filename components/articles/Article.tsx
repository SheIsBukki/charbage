"use client";
import Image from "next/image";
import { regularDate } from "@/utils/helpers";
import { Interweave } from "interweave";
import md from "@/utils/md";
import { PostType } from "@/components/articles/ArticleCards";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// export type PostDataType = {
//   posts: PostType | null;
//   error: null | string;
// };

export type ReactionCountType = {
  comments: number;
  bookmarks: number;
  likes: number;
} | null;

export type DeletePostActionType = (id: string) => Promise<
  | {
      error: string;
      result: null;
    }
  | {
      result: string;
      error: null;
    }
>;

export default function Article({
  post,
  reactionCount,
  deletePostAction,
  authorisedPostAuthor,
}: {
  post: PostType;
  reactionCount: ReactionCountType;
  deletePostAction: DeletePostActionType;
  authorisedPostAuthor: boolean;
}) {
  return (
    <>
      <div className="mx-auto w-4/5">
        {/*Title*/}
        <h1 className="mb-1 font-bold md:text-xl">{post.title}</h1>
        {/*Featured image*/}
        {post.featuredImage && (
          <div className="col-span-2 size-full rounded-lg">
            <figure className="relative h-[150px] w-full">
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
            <p className="font-semibold">{post.author}</p>
            <p className="dark:text-gray-400"> {regularDate(post.createdAt)}</p>
          </div>
        </div>
        {/*Post content*/}
        <div className="col-span-4">
          <Interweave
            className="dark:text-gray-400"
            content={md.render(post.content)}
          />
        </div>
        <div className="">
          <p>{reactionCount?.comments} Comments</p>
          <p>{reactionCount?.likes} Likes</p>
          <p>{reactionCount?.bookmarks} Bookmarks</p>
        </div>

        {authorisedPostAuthor && (
          <div className="">
            <button
              onClick={async () => {
                await deletePostAction(post.id);
                redirect("/");
              }}
            >
              Delete article
            </button>
          </div>
        )}
      </div>
    </>
  );
}
