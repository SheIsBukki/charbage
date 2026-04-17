import { Tag } from "@/db/schema";

export default function PreviewTags({
  previewTags,
  handleAddOrRemoveTagAction,
}: {
  previewTags: Array<Tag>;
  handleAddOrRemoveTagAction: (tag: Tag) => void;
}) {
  return (
    <div className="mb-6 mt-12 flex flex-wrap items-center gap-2">
      {previewTags.map((tag) => (
        <button
          type="button"
          onClick={() => handleAddOrRemoveTagAction(tag)}
          className="list-none rounded-md bg-gray-100 p-2 dark:bg-gray-700"
          key={tag.id}
        >
          <p className="">{tag.name}</p>
        </button>
      ))}
    </div>
  );
}
