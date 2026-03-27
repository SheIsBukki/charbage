import { getCurrentSession } from "@/lib/session";
import { getPostWithSlug } from "@/db/queries/select";
import { redirect } from "next/navigation";
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

  return (
    <div>
      <ArticleForm
        userId={authorisedPostAuthor}
        action={createOrEditPostAction}
        values={{
          postId: post.id,
          slug: post.slug,
          title: post.title,
          description: post.description || "",
          content: post.content,
          featuredImage: post.featuredImage || "",
        }}
        editorStatus={{
          updating: true,
          creating: false,
        }}
      />
    </div>
  );
}
