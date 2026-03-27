import { getCurrentSession } from "@/lib/session";
import { getPostWithSlug } from "@/db/queries/select";
import { ArticleFormSchema } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { PostActionStateType, PostFormValues } from "@/app/write/page";
import { updatePost } from "@/db/queries/update";
import ArticleForm from "@/components/editor/ArticleForm";
import slugify from "slugify";

type OldValues = {
  postId: string;
  featuredImage?: string;
  description?: string;
  slug: string;
  title: string;
  content: string;
};

const submitForm = async (
  initialState: PostActionStateType,
  formData: FormData,
) => {
  "use server";

  const values: PostFormValues = {
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    content: String(formData.get("content")),
    featuredImage: String(formData.get("featuredImage") || ""),
  };

  const oldValues: OldValues = JSON.parse(String(formData.get("oldValues")));

  const { error: parseError } = ArticleFormSchema.safeParse(values);
  const errors: PostActionStateType["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  values.slug =
    oldValues.title === values.title
      ? oldValues.slug
      : encodeURIComponent(
          `${slugify(values.title.toLowerCase())}-${oldValues.slug.slice(-6)}`,
        );

  let isSubmitSuccessful;

  const hasPostChanged =
    oldValues.postId === undefined
      ? undefined
      : values.title !== oldValues.title ||
        values.description !== oldValues.description ||
        values.content !== oldValues.content ||
        values.featuredImage !== oldValues.featuredImage;

  const editorStatus = {
    updating:
      oldValues.title !== "" && oldValues.content !== "" && !!oldValues.slug,
    creating:
      oldValues.title === "" && oldValues.content === "" && !values.slug,
  };

  console.log(hasPostChanged);
  console.log(editorStatus);

  if (editorStatus.updating && hasPostChanged) {
    const updatedPost = await updatePost(oldValues.postId, values);
    // I need to retrieve tagId from localStorage
    if (updatedPost !== "Failed to update post") {
      isSubmitSuccessful = true;
      // revalidatePath("/write");
    }
  }

  return {
    values,
    errors: {},
    hasPostChanged: hasPostChanged,
    isSubmitSuccessful: isSubmitSuccessful,
  };
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

  return (
    <div>
      <ArticleForm
        userId={authorisedPostAuthor}
        action={submitForm}
        values={{
          postId: post.id,
          title: post.title,
          slug: post.slug,
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
