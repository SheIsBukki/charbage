import type { Metadata } from "next";
import { getTags } from "@/db/queries/select";

export const metadata: Metadata = {
  title: "Tag Page",
  description: "Markdown editor with cool features",
};
export default async function TagPage() {
  const tags = await getTags();

  if (!tags.data) {
    throw new Error("Something went wrong with getting all tags");
  }
  return <div>Tag Page</div>;
}
