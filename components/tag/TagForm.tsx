"use client";

import { createTag } from "@/db/queries/insert";
import { TagFormSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function TagForm() {
  // const [openTagForm, setOpenTagForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(TagFormSchema),
    defaultValues: { name: "", description: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: { name: string; description: string }) => {
    const parsed = TagFormSchema.safeParse(data);

    if (!parsed.success) {
      return { errors: parsed.error.flatten() };
    }

    const tag = await createTag(parsed.data.name, parsed.data.description);

    if (tag.error && tag.error === "Sorry, tag already exists") {
      toast.error("Sorry, tag already exists");
    } else if (tag.tag) {
      toast.success("Tag successfully created!");
    }

    // console.log(parsed);
    // console.log(tag);
    // console.log(errors);

    reset();
    return tag;
    // return data;
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <input
            id="name"
            type="text"
            {...register("name")}
            className="h-full w-full rounded-lg border px-2 py-4 text-lg outline-0 focus:outline-0 dark:border-gray-500"
            placeholder="Tag name"
          />

          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-red-500 md:text-base">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="">
          <textarea
            id="description"
            {...register("description")}
            className="h-full w-full rounded-lg border px-2 py-4 text-lg outline-0 focus:outline-0 dark:border-gray-500"
            placeholder="Tag description"
            maxLength={300}
            minLength={5}
          />
          {errors.description && (
            <p role="alert" className="mt-1 text-xs text-red-500 md:text-base">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-purple-500 px-4 py-2 text-lg text-white"
        >
          Create tag
        </button>
      </form>
    </div>
  );
}

/**
 * createTag() and addTag() will return tag data, so that I can extract the tagId
 * Other tag stuff: removeTag(), deleteTag(), getTags(), and getPostsByTag()
 * 
 * getTags() fetches all tags with pagination showing 10 tags per page—not actual webpage btw


 * if a user creates a tag and submits, the tag is submitted immediately and won't affect the article submission.
 * When a user chooses a tag or up to three tags for their article, it doesn't actually trigger addTag() until after the article has been submitted. The tag selection form just holds the selected tags in the localStorage with the article which should also be in the localStorage btw. The addTag() kicks off immediately after the createPost() kicks off.
 * */
