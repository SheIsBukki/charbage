import type { Metadata } from "next";
import React from "react";
import SidebarNav from "@/components/editor/SidebarNav";

export const metadata: Metadata = {
  title: "Editor Page",
  description: "Markdown editor with cool features",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SidebarNav />
      {children}
    </main>
  );
}
