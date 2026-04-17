import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import ArticleForm from "@/components/editor/ArticleForm";
import { createOrEditPostAction } from "@/app/actions/createOrEditPostAction";
import { getTags } from "@/db/queries/select";

export default async function WritePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/sign-in");
  }

  const tags = await getTags();

  if (!tags.data) {
    throw new Error("Something went wrong with getting all tags");
  }

  return (
    <ArticleForm
      userId={user.id}
      action={createOrEditPostAction}
      values={{
        title: "",
        description: "",
        content: "",
        featuredImage: "",
      }}
      editorStatus={{
        updating: false,
        creating: true,
      }}
      tagData={tags.data}
    />
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
