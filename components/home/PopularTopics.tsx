import Link from "next/link";

export default function PopularTopics() {
  const staticTopics = [
    "React",
    "JavaScript",
    "Linux",
    "Yoruba Cinema",
    "VueJS",
    "World History",
    "Finance",
    "Fitness",
    "Food",
    "Literature",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {staticTopics.map((topic, index) => (
        <span
          key={index}
          className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800"
        >
          <Link href="#">{topic}</Link>
        </span>
      ))}
    </div>
  );
}
