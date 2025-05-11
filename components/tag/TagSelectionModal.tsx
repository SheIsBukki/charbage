// "use client";

import toast from "react-hot-toast";
import { getTags, searchTags } from "@/db/queries/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TagSearchSchema } from "@/lib/definitions";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

// const getPopularTags = async () => {
const tags = await getTags();

if (!tags.data) {
  toast.error("Something went wrong with getting all tags");
  throw new Error("Something went wrong with getting all tags");
  // return;
}

// I will use this extractedTag if I don't want the userId
const extractedTag = tags.data.map((tag) => {
  const { name, description, id, slug } = tag;

  return { name, description, id, slug };
});
// };
export default function TagSelectionModal() {
  const handleSearch = async (keyword: string) => {
    console.log(keyword);

    const parsed = TagSearchSchema.safeParse(keyword);

    if (!parsed.success) {
      return;
    }

    const [searchedTag] = await searchTags(parsed.data.keyword);
    console.log(searchedTag.name);

    // const { name, description, id, slug } = searchedTag;

    // return { name, description, id, slug };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Select Tag</Button>
      </DialogTrigger>
      <DialogContent className="h-[30%] overflow-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select up to three tags</DialogTitle>
          <DialogDescription>All available tags</DialogDescription>
        </DialogHeader>

        <div className="">
          {/*<p className="">Select a tag</p>*/}

          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <input
              placeholder="search tag..."
              type="text"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              onChange={(event) => handleSearch(event.target.value)}
            />
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          {/*Top 10 popular tags*/}
          <div className="m-4">
            <p className="">Popular tags</p>
            {extractedTag.map((tag) => (
              <div key={tag.id} className="m-4">
                <p className="">{tag.name}</p>
                <p className="">{tag.description}</p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Select tag</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
