"use client";

import { useEffect, useRef, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { regularDate } from "@/utils/helpers";
import { BsThreeDots } from "react-icons/bs";
import { DbActionType } from "@/lib/types";
import { useRouter } from "next/navigation";
import CommentForm from "@/components/comments/CommentForm";
import { createOrEditCommentAction } from "@/app/actions/createOrEditCommentAction";
import CommentSettings from "@/components/comments/CommentSettings";

// THE ACTUAL commentId will be string type, not number
export default function CommentCard({
  commentId,
  comment,
  createdAt,
  author,
  authorisedCommentAuthor,
  deleteCommentAction,
}: {
  commentId: string;
  comment: string;
  createdAt: Date;
  author: string;
  authorisedCommentAuthor: boolean;
  deleteCommentAction: DbActionType;
}) {
  const [openNestedReply, setOpenNestedReply] = useState<
    { opened: boolean; key: string }[]
  >([]);

  const [isEditing, setIsEditing] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const nestedReplyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    openNestedReply.map((item) => {
      if (String(item.key) === nestedReplyRef.current?.id) {
        nestedReplyRef.current?.focus();
      }

      return () => nestedReplyRef.current?.blur();
    });
  }, [openNestedReply]);

  const router = useRouter();

  return (
    <div className="w-full space-y-8 rounded-md border-t-2 pb-2 pt-6 text-sm dark:text-gray-300">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <figure className="">
            <div className="h-8 w-8 rounded-full bg-gray-500"></div>
          </figure>
          <p className="flex flex-col space-y-[0.5px]">
            <span className="">{author}</span>
            <span className="text-xs">{regularDate(createdAt)}</span>
          </p>
        </div>
        {/*COMMENT SETTINGS SIMILAR TO ARTICLE SETTINGS WITH TWO FEATURES, EDIT AND DELETE*/}
        {authorisedCommentAuthor && (
          <div onClick={() => setOpenSettings(!openSettings)} className="">
            <BsThreeDots />
          </div>
        )}
        {/*COMMENT SETTINGS*/}
        {openSettings && (
          <div className="">
            <CommentSettings
              commentId={commentId}
              deleteCommentAction={deleteCommentAction}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        )}
      </div>
      {openSettings && isEditing && (
        <CommentForm
          action={createOrEditCommentAction}
          value={{ comment: comment, commentId: commentId }}
          setIsEditing={setIsEditing}
        />
      )}
      <p className="text-pretty leading-relaxed dark:text-gray-400">
        {comment}
      </p>

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
          onClick={() => {
            const isReplyButtonClicked = openNestedReply.findIndex(
              (item) => item.key === commentId,
            );

            if (isReplyButtonClicked === -1) {
              setOpenNestedReply((prev) => [
                ...prev,
                { opened: true, key: commentId },
              ]);
            } else {
              setOpenNestedReply(
                openNestedReply.filter((item) => item.key !== commentId),
              );
            }
          }}
          className="rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-700"
        >
          Reply
        </button>
      </div>

      {openNestedReply.some((item) => item.key === commentId) && (
        <div className="borde-2 border-red-500 py-4">
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
