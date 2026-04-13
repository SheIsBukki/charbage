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

export default function PaginationWrapper({
  dataFetcherAction,
  children,
  dataExtractorName,
  setMoreDataAction,
  userId,
  jump = true,
}: {
  dataFetcherAction: Function;
  children: JSX.Element[] | JSX.Element;
  dataExtractorName: string;
  setMoreDataAction: Dispatch<SetStateAction<any[]>>;
  userId?: string;
  jump?: boolean;
}) {
  const [page, setPage] = useState(2);
  const heightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (jump) window.scrollTo(0, heightRef?.current?.offsetHeight as number);
    };
  }, [page]);

  const [endOfData, setEndOfData] = useState(false);

  return (
    <div ref={heightRef}>
      {children}
      <div className="mx-auto w-fit">
        <button
          type="button"
          onClick={async () => {
            if (endOfData) return;

            let fetchedData;
            if (userId) {
              fetchedData = await dataFetcherAction(userId, page);
            } else {
              fetchedData = await dataFetcherAction(page);
            }
            const newData = fetchedData[dataExtractorName];

            if (newData) {
              setEndOfData(!newData.length);
              setMoreDataAction((prev) => [...prev, ...newData]);
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
