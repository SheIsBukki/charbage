/*
I will give this user props and other props I think...
* */
export default function CommentForm() {
  return (
    <div className="py-4">
      {/*Will place current user's avatar and name*/}
      <form className="space-y-4" action="">
        <textarea
          className="border-1 w-full rounded-lg bg-gray-100 outline outline-[0.4px] dark:bg-gray-900"
          rows={5}
          cols={100}
          placeholder="Share your opinion"
        />
        <button
          className="rounded-full bg-purple-600 px-4 py-2 text-white"
          onClick={(e) => e.preventDefault()}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
