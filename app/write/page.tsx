import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import ArticleForm from "@/components/editor/ArticleForm";
import { ArticleFormSchema } from "@/lib/definitions";
import { createPost } from "@/db/queries/insert";

export type PostFormValues = {
  title: string;
  content: string;
  featuredImage: string;
};

export type ActionState = {
  errors: Record<string, { message: string }>;
  values: PostFormValues;
};

const submitForm = async (initialState: ActionState, formData: FormData) => {
  "use server";

  const values: PostFormValues = {
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
    return redirect("/sign-in");
  }

  return (
    <div className="my-8">
      <ArticleForm
        action={submitForm}
        values={{ title: "", content: "", featuredImage: "" }}
      />
    </div>
  );
}

/**
 * The blog form will ask users to fill blog title and markdown content, feaatured image is optional
 * Before sending to database, the blog creation will generate a slug for the blog and record the user data and blog data
 * Blog title
 * Slug
 * Markdown content
 * User data: name and id
 * Blog data: date created, data updated, blog id
 * Featured Image?
 *
 *
 * Tags — array of strings
 *
 *
 * // This is for posts—not applicable to ArticleForm
 * Comments — array of objects
 * Bookmarks — number, probably an array of numbers
 * Likes — number, probably an array of nunbers
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
      <Interweave content={md.render(markdownContent)} />
 * */
