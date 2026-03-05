import { getCurrentSession } from "@/lib/session";
import { getPostWithSlug } from "@/db/queries/select";
import { ArticleFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { ActionState, PostFormValues } from "@/app/write/page";
import { updatePost } from "@/db/queries/update";
import ArticleForm from "@/components/editor/ArticleForm";
import slugify from "slugify";

type updatedPostType = PostFormValues & {
  slug?: string;
};

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

  const submitForm = async (initialState: ActionState, formData: FormData) => {
    "use server";

    const values: updatedPostType = {
      title: String(formData.get("title") || ""),
      content: String(formData.get("content") || ""),
      featuredImage: String(formData.get("featuredImage") || ""),
    };

    const { error: parseError } = ArticleFormSchema.safeParse(values);
    const errors: ActionState["errors"] = {};

    for (const { path, message } of parseError?.issues || []) {
      errors[path.join(".")] = { message };
    }

    values.slug =
      post.title === values.title
        ? post.slug
        : encodeURIComponent(
            `${slugify(values.title.toLowerCase())}-${slug.slice(-6)}`,
          );

    let hasPostChanged;
    if (
      values.title === post.title &&
      values.content === post.content &&
      values.featuredImage === post.featuredImage
    ) {
      hasPostChanged = false;
    } else {
      const updatedPost = await updatePost(post.id, values);

      // I need to retrieve tagId from localStorage
      if (updatedPost !== "Failed to update post") {
        // console.log(updatedPost);
        redirect(`/blog/${updatedPost.slug}`);
      }
    }
    // console.log(values);
    return { values, errors: {}, hasPostChanged: hasPostChanged };
  };

  return (
    <div>
      <ArticleForm
        userId={authorisedPostAuthor}
        action={submitForm}
        values={{
          title: post.title,
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
