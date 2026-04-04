"use client";

import { useEffect, useRef, useState } from "react";
import { Interweave } from "interweave";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { regularDate } from "@/utils/helpers";
import { DbActionType } from "@/lib/types";
import CommentForm from "@/components/comments/CommentForm";
import { createOrEditCommentAction } from "@/app/actions/createOrEditCommentAction";
import CommentSettings from "@/components/comments/CommentSettings";
import md from "@/utils/md";
import Link from "next/link";

export default function CommentCard({
  commentId,
  comment,
  createdAt,
  updatedAt,
  author,
  authorisedCommentAuthor,
  deleteCommentAction,
}: {
  commentId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date | null;
  author: string;
  authorisedCommentAuthor: boolean;
  deleteCommentAction: DbActionType;
}) {
  const [isNestedReplyOpen, setIsNestedReplyOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const nestedReplyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isNestedReplyOpen && nestedReplyRef.current) {
      nestedReplyRef.current.focus();
    }
  }, [isNestedReplyOpen]);

  return (
    <div className="relativ w-full space-y-6 rounded-md border-t-2 pb-2 pt-6 text-sm dark:text-gray-300">
      <div className="relative flex justify-between">
        {/*COMMENT AUTHOR AND COMMENT INFO*/}
        <div className="flex items-center space-x-2">
          <Link href={`/@${author}`}>
            <figure className="">
              <div className="h-8 w-8 rounded-full bg-gray-500"></div>
            </figure>
          </Link>
          <p className="flex flex-col space-y-[0.5px]">
            <span className="">
              <Link href={`/@${author}`}>{author}</Link>
            </span>
            <span className="text-xs">
              {regularDate(createdAt)}{" "}
              {updatedAt && (
                <>
                  &#124; Edited{" "}
                  <span className="hidden md:inline-block">
                    on {regularDate(updatedAt)}{" "}
                  </span>
                </>
              )}
            </span>
          </p>
        </div>
        {/*COMMENT SETTINGS BUTTON*/}
        {authorisedCommentAuthor && (
          <button
            type="button"
            onClick={() => {
              setOpenSettings(!openSettings);
            }}
            className=""
          >
            <BsThreeDots />
          </button>
        )}
        {/*COMMENT SETTINGS*/}
        {openSettings && (
          <div className="boder-red-500 absolute right-0 top-10 z-30 flex flex-col space-y-2 rounded-lg border-2 bg-white py-1 text-base dark:bg-gray-900">
            <CommentSettings
              commentId={commentId}
              deleteCommentAction={deleteCommentAction}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        )}
      </div>
      {/*COMMENT FORM OR COMMENT*/}
      <div className="boder border-red-500 px-2">
        {isEditing ? (
          <CommentForm
            action={createOrEditCommentAction}
            values={{ comment: comment, commentId: commentId }}
            setOpenSettings={setOpenSettings}
            setIsEditing={setIsEditing}
          />
        ) : (
          <Interweave
            className="leading-relaxed dark:text-gray-400"
            content={md.render(comment)}
          />
        )}
      </div>

      {/*REACTIONS TO COMMENTS*/}
      <div className="flex items-center space-x-6">
        <p className="flex items-center space-x-1">
          <MdOutlineFavoriteBorder className="text-xl" />{" "}
          <span className="">4</span>
        </p>
        <p className="flex items-center space-x-1">
          <BiCommentDetail className="text-xl" /> <span className="">9</span>
        </p>
        <button
          key={commentId}
          onClick={() => setIsNestedReplyOpen(!isNestedReplyOpen)}
          className="rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-700"
        >
          Reply
        </button>
      </div>

      {isNestedReplyOpen && (
        <div className="borde-2 border-red-500 px-6 py-4">
          {/*Will place current user avatar and name*/}
          <form className="space-y-4" action="">
            <textarea
              id={`${commentId}`}
              ref={nestedReplyRef}
              className="border-1 w-full rounded-lg bg-gray-100 outline outline-1 dark:bg-gray-900"
              rows={5}
              cols={100}
              placeholder={`Replying to ${author}`}
            />
            <button
              className="rounded-full bg-purple-600 px-4 py-2 text-white"
              onClick={(e) => e.preventDefault()}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
