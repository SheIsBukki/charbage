import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPostReactionsWithId,
  getPostWithSlug,
  getProfileWithSlug,
} from "@/db/queries/select";
import Article from "@/components/articles/Article";
import { getCurrentSession } from "@/lib/session";
import { deleteComment, deletePost } from "@/db/queries/delete";
import CommentForm from "@/components/comments/CommentForm";
import CommentCard from "@/components/comments/CommentCard";
import { Comment } from "@/db/schema";
import { createOrEditCommentAction } from "@/app/actions/createOrEditCommentAction";
import Avatar from "@/app/ui/Avatar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { post } = await getPostWithSlug((await params).slug);

  if (!post) {
    return {
      title: "Post does not exist",
    };
  }

  return {
    title: post?.title || "Blog post",
    description: post?.description || post?.content.substring(0, 160),
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
    return notFound();
  }

  let authorisedPostAuthor = "";

  if (user?.id !== null && post.userId === user?.id) {
    authorisedPostAuthor = user.id;
  }

  const { reactions } = await getPostReactionsWithId(post.id);

  const commentCount = reactions?.comments.length;
  const currentUserCommented = reactions?.comments.some(
    (comment: Comment) => comment.userId === user?.id,
  );

  const { profile: currentUserProfile } = await getProfileWithSlug(
    `@${user?.username}`,
  );

  return (
    <div className="bottom-10 mx-auto mb-24 w-full py-12 lg:w-3/5">
      <Article
        authorisedPostAuthor={!!authorisedPostAuthor}
        currentUser={user?.id}
        deletePostAction={deletePost}
        reactions={reactions}
        post={post}
      />

      {/*STATIC INTERACTIONS UI UNTIL DYNAMIC COMMENTS*/}
      <hr className="border-1 my-12" />
      <div className="container mx-auto mb-24 mt-12 space-y-[0.05rem] lg:mx-auto lg:mb-auto lg:w-4/5">
        <p id="responses" className="mb-12 px-6 text-2xl font-semibold">
          Responses ({commentCount})
        </p>

        <div className="flex space-x-2 px-2">
          {user && (
            <Link href={`/${currentUserProfile?.slug}`}>
              <Avatar
                avatarUrl={currentUserProfile?.avatar || ""}
                alt={user?.username || ""}
                defaultSize={8}
                mdToLgSize={8}
              />
            </Link>
          )}
          <div className="mb mb-4 w-full">
            <CommentForm
              currentUser={user?.id}
              action={createOrEditCommentAction}
              values={{
                comment: "",
                postId: post.id,
                userId: user?.id || "",
              }}
            />
          </div>
        </div>

        {/*  COMMENT CARDS */}
        <div className="container mx-auto w-full space-y-4 px-8">
          {reactions?.comments.map(
            async ({ id, content, createdAt, author, userId, updatedAt }) => {
              const { profile } = await getProfileWithSlug(`@${author}`);

              const fullName =
                `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();

              return (
                <CommentCard
                  key={id}
                  commentId={id}
                  comment={content}
                  createdAt={createdAt}
                  authorName={fullName || author}
                  authorSlug={`@${author}`}
                  authorAvatar={profile?.avatar || ""}
                  updatedAt={updatedAt}
                  authorisedCommentAuthor={user?.id === userId}
                  deleteCommentAction={deleteComment}
                  currentUser={user?.id || ""}
                />
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
