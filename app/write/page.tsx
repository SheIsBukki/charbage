import { getCurrentSession } from "@/app/lib/session";
import ArticleForm from "@/app/components/editor/ArticleForm";
import { redirect } from "next/navigation";
import { ArticleFormSchema } from "@/app/lib/definitions";
import { createPost } from "@/app/db/queries/insert";
import { Post } from "@/app/db/schema";

type ActionState = {
  errors: Record<string, { message: string }>;
  values: Post;
};

const submitForm = async (initialState: ActionState, formData: FormData) => {
  "use server";

  const values = {
    title: String(formData.get("title") || ""),
    content: String(formData.get("content") || ""),
    featuredImage: String(formData.get("featuredImage") || ""),
  };

  const { error: parseError } = ArticleFormSchema.safeParse(values);
  const errors: ActionState["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  await createPost(values);
  return { values, errors: {} };
};

export default async function WritePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  return (
    /**/
    <div className="my-8">
      <ArticleForm action={submitForm} />
    </div>
  );
}

/**
 * async function onSubmit(data: z.infer<typeof ArticleFormSchema>) {
  "use server";
  setSubmitting(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await createPost(data);
    console.log("Blog Post Submitted:", data);

    toast({
      title: "Blog Post Created",
      description: `"${data.title}" submitted successfully!`,
    });

    reset();
  } catch (error) {
    toast({
      title: "Blog Post Submission Failed",
      description: "There was an error submitting your blog post",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
}
 * */

/**
 * The blog form will ask users to fill blog title and markdown content, feaatured image is optional
 * Before sending to database, the blog creation will generate a slug for the blog and record the user data and blog data
 * Blog title
 * Slug
 * Markdown content
 * User data—name and id
 * Blog data—date created, data updated, blog id
 * Featured Image?
 *
 *
 * Tags
 * Comments
 * Bookmarks
 * Likes
 * */

/**
 * OPTIONS TO DISPLAY FETCHED MARKDOWN CONTENT
      <MDEditor.Markdown
        source={markdownContent}
        style={{ whiteSpace: "pre-wrap" }}
      />

      <MDEditor.Markdown
        source={md.render(markdownContent)}
        style={{ whiteSpace: "pre-wrap" }}
      />

      <div dangerouslySetInnerHTML={{ __html: md.render(markdownContent) }} />
 * */
