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
import { PaginationFetcherAndKindType } from "@/lib/types";

export default function PaginationWrapper({
  children,
  setMoreDataAction,
  id,
  jump = true,
  fetcherAndKind,
}: {
  children: JSX.Element[] | JSX.Element;
  setMoreDataAction: Dispatch<SetStateAction<any[]>>;
  id?: string;
  jump?: boolean;
  fetcherAndKind: PaginationFetcherAndKindType;
}) {
  const [page, setPage] = useState(2);
  const heightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (jump) window.scrollTo(0, heightRef?.current?.offsetHeight as number);
    };
  }, [page]);

  const [endOfData, setEndOfData] = useState(false);

  const { fetchKind, dataFetcher } = fetcherAndKind;

  return (
    <div ref={heightRef}>
      {children}
      <div className="mx-auto w-fit">
        <button
          type="button"
          onClick={async () => {
            if (endOfData) return;

            if (fetchKind === "postsByUser") {
              const fetched = await dataFetcher(id!, page);
              const newData = fetched.posts;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            } else if (fetchKind === "currentUserBookmarks") {
              const fetched = await dataFetcher(id!, page);
              const newData = fetched.result;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            } else {
              const fetched = await dataFetcher(page);
              const newData = fetched.posts;
              if (newData) {
                setEndOfData(!newData.length);
                setMoreDataAction((prev) => [...prev, ...newData]);
              }
            }

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
