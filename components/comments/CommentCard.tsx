import { useEffect, useRef, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";

// THE ACTUAL commentId will be string type, not number
export default function CommentCard({
  commentId,
  comment,
}: {
  commentId: null | number;
  comment: string;
}) {
  const [openNestedReplyBox, setOpenNestedReplyBox] = useState<
    { opened: boolean; key: null | number }[]
  >([]);

  const innerReplyRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    openNestedReplyBox.map((item) => {
      if (String(item.key) === innerReplyRef.current?.id) {
        innerReplyRef.current?.focus();
      }
    });
  }, [openNestedReplyBox]);
  return (
    <div className="space-y-8 rounded-md border-t-2 px-4 pb-2 pt-6 text-sm dark:text-gray-300">
      <div className="flex items-center space-x-2">
        <figure className="">
          <div className="h-8 w-8 rounded-full bg-gray-500"></div>
        </figure>
        <p className="flex flex-col space-y-[0.5px]">
          <span className="">Janette Dough</span>
          <span className="">23 Nov, 2015</span>
        </p>
      </div>
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
            const isReplyClicked = openNestedReplyBox.findIndex(
              (item) => item.key === commentId,
            );

            if (isReplyClicked === -1) {
              setOpenNestedReplyBox((prev) => [
                ...prev,
                { opened: true, key: commentId },
              ]);
            } else {
              setOpenNestedReplyBox(
                openNestedReplyBox.filter((item) => item.key !== commentId),
              );
            }
          }}
          className="rounded-full bg-gray-200 px-4 py-1 dark:bg-gray-700"
        >
          Reply
        </button>
      </div>

      {openNestedReplyBox.some((item) => item.key === commentId) && (
        <div className="borde-2 border-red-500 py-4">
          {/*Will place current user avatar and name*/}
          <form className="space-y-4" action="">
            <textarea
              id={`${commentId}`}
              ref={innerReplyRef}
              className="border-1 w-full rounded-lg bg-gray-100 outline outline-1 dark:bg-gray-900"
              rows={5}
              cols={100}
              placeholder="Replying to Janette Dough"
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
