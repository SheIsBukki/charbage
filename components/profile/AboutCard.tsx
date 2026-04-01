import { LuUser } from "react-icons/lu";
import { Interweave } from "interweave";
import md from "@/utils/md";

export default function AboutCard({ about }: { about: string }) {
  return (
    <section className="p3 space-y-4 border-b px-8 py-4 text-gray-700 md:px-4 lg:rounded-2xl lg:border dark:text-gray-400">
      <p className="flex items-center space-x-3 text-xl font-semibold">
        <span className="rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
          <LuUser className="text-2xl text-indigo-500" />
        </span>
        <span style={{ color: "initial" }} className="[color:initial]">
          About
        </span>
      </p>
      <article className="">
        <Interweave
          className="text-pretty leading-relaxed"
          content={md.render(about)}
        />
      </article>
    </section>
  );
}
