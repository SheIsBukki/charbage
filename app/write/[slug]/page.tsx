import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { getPostWithSlug, getTags } from "@/db/queries/select";
import ArticleForm from "@/components/editor/ArticleForm";
import { createOrEditPostAction } from "@/app/actions/createOrEditPostAction";

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user } = await getCurrentSession();
  const { slug } = await params;
  const { post } = await getPostWithSlug(slug);

  if (!post) {
    return;
  }

  if (!user || post.userId !== user.id) {
    redirect(`/blog/${post.slug}`);
  }

  const authorisedPostAuthor = user.id;

  const tags = await getTags();

  if (!tags.data) {
    throw new Error("Something went wrong with getting all tags");
  }

  return (
    <ArticleForm
      tagData={tags.data}
      userId={authorisedPostAuthor}
      action={createOrEditPostAction}
      values={{
        postId: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description || "",
        content: post.content,
        featuredImage: post.featuredImage || "",
        tags: JSON.stringify(post.tags || []),
      }}
      editorStatus={{
        updating: true,
        creating: false,
      }}
    />
  );
}
