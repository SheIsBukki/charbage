import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto w-fit place-content-center place-items-center items-center space-y-4 p-4">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        Return <span className="underline">Home</span>{" "}
      </Link>
    </div>
  );
}
