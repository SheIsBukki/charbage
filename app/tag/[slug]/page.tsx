import { getTagWithSlug } from "@/db/queries/select";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { result: tag } = await getTagWithSlug((await params).slug);

  if (!tag) {
    return {
      title: "Slug does not exist",
    };
  }

  return {
    title: tag?.name || "Slug page",
    description: tag?.description || "Tag",
  };
}

export default async function TagSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { result: tag } = await getTagWithSlug((await params).slug);

  if (!tag) {
    return notFound();
  }
  return (
    <div>
      <p className="">Tag Page</p>
      <p className="">{tag.name}</p>
    </div>
  );
}
