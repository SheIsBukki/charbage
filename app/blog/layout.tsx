import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page",
  description: "Blog post {insert dynamic title later, hope I don't forget}",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main>{children}</main>;
}
