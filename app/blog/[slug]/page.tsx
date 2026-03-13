"use server";

import {
  getPostReactionCountWithId,
  getPostWithSlug,
} from "@/db/queries/select";
import Article from "@/components/articles/Article";
import { getCurrentSession } from "@/lib/session";
import { deletePost } from "@/db/queries/delete";
import MainNav from "@/app/ui/MainNav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { post } = await getPostWithSlug((await params).slug);

  return {
    title: post?.title || "Blog post",
    description:
      post?.content.substring(0, 100) || `Written by ${post?.author}`,
  };
}

export default async function BlogPage({
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

  let authorisedPostAuthor = "";

  if (user?.id !== null && post.userId === user?.id) {
    authorisedPostAuthor = user.id;
  }

  const { reactionCount } = await getPostReactionCountWithId(post.id);

  return (
    <>
      <MainNav user={user} />
      <Article
        authorisedPostAuthor={!!authorisedPostAuthor}
        deletePostAction={deletePost}
        reactionCount={reactionCount}
        post={post}
      />
    </>
  );
}
