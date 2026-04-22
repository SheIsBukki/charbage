"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { searchTags } from "@/db/queries/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TagSearchSchema } from "@/lib/definitions";
import { Tag } from "@/db/schema";
// import { useDebouncedSearch } from "@/utils/useDebouncedSearch";
import { useDebouncedCallback } from "use-debounce";

export default function TagSelectionModal({
  tagData,
  tags,
  handleAddOrRemoveTagAction,
}: {
  tagData: Tag[];
  tags: Array<Tag>;
  handleAddOrRemoveTagAction: (tag: Tag) => void;
}) {
  const [searchedTag, setSearchedTag] = useState<Tag | null>(null);
  // const [searchedTags, setSearchedTags] = useState<Tag[]>([]);
  const [searchedTagSelected, setSearchedTagSelected] = useState(false);
  const searchedTagRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (searchedTagSelected) {
      if (searchedTagRef.current) {
        searchedTagRef.current.value = "";
      }

      timeoutId = setTimeout(() => {
        setSearchedTag(null);
        // setSearchedTags([]);
        setSearchedTagSelected(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [searchedTagSelected]);

  // const handleDebouncedSearch = useDebouncedSearch(400);

  // const handleSearch = (keyword: string) => {
  //   const parsed = TagSearchSchema.safeParse({ keyword: keyword });
  //
  //   if (!parsed.success) {
  //     return;
  //   }
  //
  //   // THIS DEBOUNCED APPROACH DOESN'T USE A STATE SETTER
  //   // const searchedTag = handleDebouncedSearch(parsed.data.keyword, searchTags);
  //   // if (searchedTag) {
  //   //   setSearchedTag(searchedTag as unknown as Tag);
  //   // }
  //
  //   handleDebouncedSearch(parsed.data.keyword, searchTags, setSearchedTag);
  //
  //   // const searchedTag = await searchTags(parsed.data.keyword);
  //   // return searchedTag;
  // };

  /*
   * I'LL USE THIS IF I DON'T NEED TO USE A UNIFIED debounced search function
   * */
  const handleSearch = useDebouncedCallback(async (keyword: string) => {
    const parsed = TagSearchSchema.safeParse({ keyword: keyword });
    //
    if (!parsed.success) {
      return;
    }

    const searchedTag = await searchTags(parsed.data.keyword);
    if (searchedTag) {
      setSearchedTag(searchedTag);
    }
    // const searchedTags = await searchTags(parsed.data.keyword);
    // if (searchedTags) {
    //   setSearchedTags(searchedTags);
    // }
  }, 500);

  // console.log(searchedTag);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Select Tag</Button>
      </DialogTrigger>
      <DialogContent className="h-[30%] overflow-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select up to three tags</DialogTitle>
          <DialogDescription>
            Type to search for tags or select tags from the list below
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              disabled={tags.length === 3}
              ref={searchedTagRef}
              name="searchTag"
              placeholder="search tag..."
              type="text"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              onChange={(event) => handleSearch(event.target.value)}
            />
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          {/*SEARCHED TAG*/}
          {searchedTag && (
            <button
              title={searchedTag.description}
              type="button"
              onClick={() => {
                handleAddOrRemoveTagAction(searchedTag);
                setSearchedTagSelected(true);
              }}
              key={searchedTag.id}
              className="m-4 list-none"
            >
              <p className="">{searchedTag.name}</p>
            </button>
          )}

          {/*NOT SURE WHETHER I WANT MULTIPLE SEARCH RESULTS*/}
          {/*SEARCHED TAGS*/}
          {/*{searchedTags && searchedTags.length > 0 && (*/}
          {/*  <div className="flex flex-shrink-0 flex-col">*/}
          {/*    {searchedTags.slice(0, 5).map((searchedTag) => (*/}
          {/*      <button*/}
          {/*        title={searchedTag.description}*/}
          {/*        type="button"*/}
          {/*        onClick={() => {*/}
          {/*          handleAddOrRemoveTagAction(searchedTag);*/}
          {/*          setSearchedTagSelected(true);*/}
          {/*        }}*/}
          {/*        key={searchedTag.id}*/}
          {/*        className="m-4 list-none"*/}
          {/*      >*/}
          {/*        <p className="">{searchedTag.name}</p>*/}
          {/*      </button>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}

          {/*SELECTED TAGS*/}
          {tags.length > 0 && (
            <div className="m-4">
              <p className="">Selected tags</p>
              {tags.map((tag) => (
                <button
                  title={tag.description}
                  type="button"
                  onClick={() => {
                    handleAddOrRemoveTagAction(tag);
                  }}
                  key={tag.id}
                  className="mx-2 my-4 list-none rounded-md bg-gray-100 p-2 dark:bg-gray-700"
                >
                  <p className="">{tag.name}</p>
                </button>
              ))}
            </div>
          )}

          {/*Top 10 popular tags*/}
          <div className="m-4">
            <p className="">Popular tags</p>
            {tagData.map((tag) => (
              <button
                title={tag.description}
                type="button"
                disabled={searchedTagSelected}
                onClick={() => handleAddOrRemoveTagAction(tag)}
                key={tag.id}
                className={clsx(
                  "m-4 list-none",
                  tags.some((selectedTag) => selectedTag.id === tag.id)
                    ? "rounded-md bg-gray-100 p-2 dark:bg-gray-700"
                    : "bg-transparent",
                )}
              >
                <p className="">{tag.name}</p>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
