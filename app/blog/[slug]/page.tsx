import { getPostReactionsWithId, getPostWithSlug } from "@/db/queries/select";
import Article from "@/components/articles/Article";
import { getCurrentSession } from "@/lib/session";
import { deleteComment, deletePost } from "@/db/queries/delete";
import CommentForm from "@/components/comments/CommentForm";
import CommentCard from "@/components/comments/CommentCard";
import { Comment } from "@/db/schema";
import { createOrEditCommentAction } from "@/app/actions/createOrEditCommentAction";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { post } = await getPostWithSlug((await params).slug);

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
    return;
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

  // console.log(reactions?.comments);

  return (
    <>
      {/*<MainNav user={user} />*/}
      <div className="bg-gay-100 darkbg-gray-900 mx-auto mb-24 w-full py-12">
        <Article
          authorisedPostAuthor={!!authorisedPostAuthor}
          currentUser={user?.id}
          deletePostAction={deletePost}
          reactions={reactions}
          post={post}
        />

        {/*STATIC INTERACTIONS UI UNTIL DYNAMIC COMMENTS*/}
        <hr className="border-1 my-12" />
        <div className="brder-2 container mx-auto mt-12 space-y-[0.05rem] border-red-500 lg:mx-auto lg:w-3/5">
          <p
            id="responses"
            className="boder-t-2 mb-12 px-6 text-2xl font-semibold"
          >
            Responses ({commentCount})
          </p>

          <div className="items-strt boder flex space-x-2 border-red-500 px-2">
            <figure className="h-8 w-8 rounded-full bg-gray-500">
              <img
                width={100}
                height={100}
                src="#"
                alt={user?.username}
                className=""
              />
            </figure>
            <div className="mb mb-4 w-full">
              {/*<span className="">{user?.name}</span>*/}
              <CommentForm
                currentUser={user?.id}
                action={createOrEditCommentAction}
                value={{ comment: "", postId: post.id, userId: user?.id || "" }}
              />
            </div>
          </div>

          {/*  COMMENT CARDS */}
          <div className="boder container mx-auto w-full space-y-4 border-red-500 px-8">
            {reactions?.comments.map(
              ({ id, content, createdAt, author, userId, updatedAt }) => (
                <CommentCard
                  key={id}
                  commentId={id}
                  comment={content}
                  createdAt={createdAt}
                  author={author}
                  updatedAt={updatedAt}
                  authorisedCommentAuthor={user?.id === userId}
                  deleteCommentAction={deleteComment}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
