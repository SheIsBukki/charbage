import { useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { search } from "@/db/queries/select";
import ArticleTitleCard from "@/components/articles/ArticleTitleCard";
import { useDisableScroll } from "@/app/ui/useDisableScroll";
import Avatar from "@/app/ui/Avatar";
import { PostResultType, ProfileResultType, TagResultType } from "@/lib/types";

export default function WholisticSearch() {
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

  const [postSearchResults, setPostSearchResults] = useState<PostResultType[]>(
    [],
  );
  const [profileSearchResults, setProfileSearchResults] = useState<
    ProfileResultType[]
  >([]);
  const [tagSearchResults, setTagSearchResults] = useState<TagResultType[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = useDebouncedCallback(
    async (searchInput: string): Promise<void> => {
      const searchResult = await search(searchInput);

      if (searchResult.result) {
        setPostSearchResults(searchResult.result.postResults);
        setProfileSearchResults(searchResult.result.profileResults);
        setTagSearchResults(searchResult.result.tagResults);
      }
    },
    500,
  );

  const handleSearchResultClick = () => {
    setOpenSearchModal(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setPostSearchResults([]);
    setProfileSearchResults([]);
    setTagSearchResults([]);
  };

  useDisableScroll(openSearchModal);

  return (
    <div className="brder h-full w-full border-red-500 md:relative md:w-1/2">
      <div className="boder relative flex flex-1 flex-shrink-0 border-red-500">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          ref={searchInputRef}
          onFocus={() => setOpenSearchModal(true)}
          onBlur={() => {
            if (
              !profileSearchResults.length &&
              !postSearchResults.length &&
              !tagSearchResults.length
            ) {
              setOpenSearchModal(false);
              if (searchInputRef.current) {
                searchInputRef.current.value = "";
              }
            }
          }}
          onChange={(event) => handleSearch(event.target.value)}
          name="search"
          placeholder="search..."
          type="text"
          className="peer block w-full rounded-md border border-gray-300 py-1 pl-10 text-sm outline-2 placeholder:text-gray-500 md:py-1.5 dark:border-gray-500 dark:placeholder:text-gray-300"
        />
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 md:size-6 dark:text-gray-300 dark:peer-focus:text-gray-100" />
      </div>

      {/*SEARCH RESULTS*/}
      {openSearchModal && (
        <div className="brder absolute left-0 right-0 z-40 mx-auto h-[60dvh] w-11/12 space-y-6 overflow-y-auto border-red-500 bg-gray-50 px-4 pb-8 pt-4 text-sm md:left-auto md:right-auto md:w-full md:space-y-4 dark:bg-gray-900">
          <p
            title="close"
            onClick={() => setOpenSearchModal(false)}
            className="fixed right-[calc(100%-91.666667%)] flex cursor-pointer justify-end md:static md:right-auto"
          >
            <MdClose className="text-2xl" />
            <span className="sr-only">Close search result modal</span>
          </p>
          <div className="space-y-6">
            <section className="">
              <p className="font-semibold">Posts</p>
              {postSearchResults.map((post) => (
                <li
                  onClick={() => handleSearchResultClick()}
                  key={post.id}
                  className="list-none rounded-md px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArticleTitleCard
                    showAuthor={false}
                    title={post.title}
                    postSlug={post.slug}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                  />
                </li>
              ))}
            </section>

            <section className="">
              <p className="font-semibold">Users</p>
              {profileSearchResults.map((profile) => (
                <Link
                  onClick={() => handleSearchResultClick()}
                  href={`/${profile.slug}`}
                  key={profile.id}
                  className="flex items-center space-x-4 rounded-md px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Avatar
                    avatarUrl={profile.avatar || ""}
                    alt={""}
                    defaultSize={10}
                    mdToLgSize={12}
                  />
                  <p className="flex flex-col space-y-1">
                    <span className="">
                      {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
                        profile?.slug?.slice(1)}
                    </span>
                    <span className="">{profile.slug}</span>
                  </p>
                </Link>
              ))}
            </section>

            <section className="flex flex-col">
              <p className="font-semibold">Tags</p>
              {tagSearchResults.slice(0, 5).map((tag) => (
                <Link
                  onClick={() => handleSearchResultClick()}
                  href={`/tag/${tag.slug}`}
                  key={tag.id}
                  className="rounded-md px-2 py-3 text-base hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  # {tag.name}
                </Link>
              ))}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
