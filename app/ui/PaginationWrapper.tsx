"use client";

import {
  Dispatch,
  JSX,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoArrowDown } from "react-icons/io5";
import {
  DataFetcherActionType,
  DataFetcherActionType2,
  FetcherAndKind,
  PostType,
  UserBookmarksType,
} from "@/lib/types";
import { Post } from "@/db/schema";

type MoreDataType = Post | PostType | UserBookmarksType;

export default function PaginationWrapper({
  // dataFetcherAction,
  children,
  // dataExtractorName,
  setMoreDataAction,
  id,
  // fetchKind,
  jump = true,
  fetcherAndKind,
}: {
  // dataFetcherAction: DataFetcherActionType;
  children: JSX.Element[] | JSX.Element;
  // dataExtractorName: string;
  // setMoreDataAction: Dispatch<SetStateAction<MoreDataType[]>>;
  setMoreDataAction: Dispatch<SetStateAction<any[]>>;
  id?: string;
  // fetchKind: string;
  jump?: boolean;
  fetcherAndKind: FetcherAndKind;
}) {
  const [page, setPage] = useState(2);
  const heightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (jump) window.scrollTo(0, heightRef?.current?.offsetHeight as number);
    };
  }, [page]);

  const [endOfData, setEndOfData] = useState(false);

  const { fetchKind, dataFetcherAction } = fetcherAndKind;

  return (
    <div ref={heightRef}>
      {children}
      <div className="mx-auto w-fit">
        <button
          type="button"
          onClick={async () => {
            if (endOfData) return;

            // let fetchedData;

            if (fetchKind === "postsByUser") {
              const fetched = await dataFetcherAction(id!, page); // DbUserPostsType
              const newData = fetched.posts;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            } else if (fetchKind === "currentUserBookmarks") {
              const fetched = await dataFetcherAction(id!, page); // DbUserBookmarksType (id === currentUserId)
              const newData = fetched.result;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            } else {
              // homepage
              const fetched = await dataFetcherAction(page); // DbHomepagePostsType
              const newData = fetched.posts;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            }

            // if (fetchKind === "homepagePosts") {
            //   fetchedData = await dataFetcherAction(page);
            // } else if (fetchKind !== "homepagePosts") {
            //   fetchedData = await dataFetcherAction(id!, page);
            // }
            // const newData = fetchedData[dataExtractorName];
            //
            // if (newData) {
            //   setEndOfData(!newData.length);
            //   setMoreDataAction((prev) => [...prev, ...newData]);
            // }

            setPage(page + 1);
          }}
          className="my-12 flex items-center space-x-2 text-gray-700 dark:text-gray-400"
        >
          <span className="text-sm">
            {!endOfData ? "Load more" : "You have reached the end!"}
          </span>
          {!endOfData && <IoArrowDown className="text-xl" />}
        </button>
      </div>
    </div>
  );
}
