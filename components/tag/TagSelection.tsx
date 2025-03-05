// import { addTag } from "@/db/queries/insert";
import { getTags } from "@/db/queries/select";
// import { Tag } from "@/db/schema";
import toast from "react-hot-toast";

export default async function TagSelection() {
  const tags = await getTags();

  // const selectTag =

  // await addTag();

  if (!tags.data) {
    toast.error("Something went wrong with getting all tags");
    return;
  }

  // I will use this extractedTag if I don't want the userId
  const extractedTag = tags.data.map((tag) => {
    const { name, description, id, slug } = tag;

    return { name, description, id, slug };
  });

  return (
    <div>
      <p className="">Select a tag</p>
      {extractedTag.map((tag) => (
        <pre key={tag.id} className="">
          {JSON.stringify(tag, null, 4)}

          {/*<h1 className="">{tag.name}</h1>
            <p className="">{tag.id}</p>
            <p className="">{tag.slug}</p>
            <p className="">{tag.description}</p>*/}
        </pre>
      ))}
    </div>
  );
}

/**
 * So, getTags provides all tag data, which is great. I need to create a click function that collects stores the data of any specific tag a user clicks in a temporary array — in the localStorage or if there's a way to pass data from this component to the grandparent WritePage, but localStorage seem more like it cos a similar approach works in the FeaturedImage.
 *
 * I will use selectTag to collect tag data and store in the localStorage to be reset when the addTag() kicks off along in the WritePage after the createPost call returns postId — I need to confirm that the createPost() call in the WritePage actually gives access to the postId upon submission, but I believe it does
 * The function will allow user to select up to three tags.
 *
 * TagSelection is also going to be a modal, but I will use shadcn this time, not a custom one
 * The TagSelection modal will eventually have two elements: a tag search input, and a paginated tag list showing 10 tags at once
 * The tag search functionality will autosuggest tags as users type in the input
 *
 * */
