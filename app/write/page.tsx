import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import ArticleForm from "@/components/editor/ArticleForm";
import { ArticleFormSchema } from "@/lib/definitions";
import { addTag, createPost } from "@/db/queries/insert";
// import TagFormModal from "@/components/tag/TagFormModal";
// import PostForm from "@/components/editor/PostForm";
// import toast from "react-hot-toast";

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

  // await createPost(values);
  // Uncomment this and use when the TagSelection component is functional — I also need to console log the data to see what it returns
  const post = await createPost(values);
  const publishedArticle = post.data;

  // I need to retrieve tagId from localStorage
  if (publishedArticle) {
    console.log(publishedArticle);

    // await addTag(publishedArticle.id, tagId);
  }

  return { values, errors: {} };
};

export default async function WritePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="container mx-auto my-8 w-[80%] gap-12 lg:grid lg:w-[90%] lg:grid-cols-8">
      <div className="col-span-2 hidden lg:block">
        <p className="">The Article Draft and other info section</p>
      </div>
      <div className="col-span-6">
        {/*<PostForm />*/}
        <ArticleForm
          action={submitForm}
          values={{ title: "", content: "", featuredImage: "" }}
        />
        {/*<TagFormModal />*/}
      </div>
    </div>
  );
}

/** 
 * TO DO: Some logic to enable tagsToPostsRelations
  If a user selects a tag—they can add up to three tags, to associate with their post when they're creating the post, there should be a way to create a relationship between said post's id and tag's id — I will insert data into the tagsToPostsTable immediately after the form is submitted. The tagsToPostsTable will accept two arguments automatically: the postId, and the tagId

  Before inserting into the tagsToPostsTable, first the user will either select from existing tags—hence db select from tagTable, or create a new tag—hence db insert into tagTable
  This will provide the tag's id that will later be used to insert into tagsToPostsTable — await addTag()

  
**/

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

      NOTE: MDEditor approach only works in client components

      <div dangerouslySetInnerHTML={{ __html: md.render(markdownContent) }} />
      <Interweave content={md.render(markdownContent)} />
 * */
