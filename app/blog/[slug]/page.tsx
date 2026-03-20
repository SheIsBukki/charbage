import { getPostReactionsWithId, getPostWithSlug } from "@/db/queries/select";
import Article from "@/components/articles/Article";
import { getCurrentSession } from "@/lib/session";
import { deleteComment, deletePost } from "@/db/queries/delete";
// import MainNav from "@/app/ui/MainNav";
import { CommentActionState, CommentFormValue } from "@/lib/types";
import { CommentFormSchema } from "@/lib/definitions";
import CommentForm from "@/components/comments/CommentForm";
import CommentCard from "@/components/comments/CommentCard";
import { Comment } from "@/db/schema";
import { createComment } from "@/db/queries/insert";
import { revalidatePath } from "next/cache";

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

  const { reactions } = await getPostReactionsWithId(post.id);

  const submitForm = async (
    initialState: CommentActionState,
    formData: FormData,
  ) => {
    "use server";

    const value: CommentFormValue = {
      comment: String(formData.get("comment") || ""),
    };

    const { error: parseError } = CommentFormSchema.safeParse(value);

    const error: CommentActionState["error"] = {};

    if (parseError) {
      error["message"] = parseError;
    }

    // I WILL WORRY ABOUT WHEN IT'S TIME TO ENABLE EDITING OF COMMENTS
    const hasCommentChanged = false;
    // const hasCommentChanged = value.content !== comment.content;

    let serverError = false;
    let isSubmitSuccessful;

    if (value.comment.trim() !== "" && user) {
      const comment = await createComment(value.comment, post.id, user.id);

      if (comment.error) {
        serverError = true;
      } else if (comment.data) {
        isSubmitSuccessful = true;
      }

      // console.log(comment);
      // console.log(comment.data);
      revalidatePath("/blog");
    }

    return {
      value,
      error: {},
      serverError: serverError,
      isSubmitSuccessful: isSubmitSuccessful,
    };
  };

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
          <p className="boder-t-2 mb-12 px-6 text-2xl font-semibold">
            Responses ({commentCount})
          </p>

          <div className="items-strt borer flex space-x-4 border-red-500 px-6">
            <figure className="h-8 w-8 rounded-full bg-gray-500">
              <img
                width={100}
                height={100}
                src="#"
                alt={user?.name}
                className=""
              />
            </figure>
            <div className="w-full">
              {/*<span className="">{user?.name}</span>*/}
              <CommentForm
                // postId={post.id}
                // userId={user?.id || ""}
                action={submitForm}
                value={{ comment: "" }}
                editorStatus={{
                  updating: currentUserCommented === true,
                  creating: currentUserCommented === false,
                }}
              />
            </div>
          </div>

          {/*  COMMENT CARDS */}
          <div className="boder container mx-auto w-full space-y-4 border-red-500 px-8">
            {reactions?.comments.map(
              ({ id, content, createdAt, author, userId }) => (
                <CommentCard
                  key={id}
                  commentId={id}
                  comment={content}
                  createdAt={createdAt}
                  author={author}
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
