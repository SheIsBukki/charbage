"use client";

import { useState } from "react";
import { PaginationFetcherAndKindType, PostType } from "@/lib/types";
import ArticleCard from "@/components/articles/ArticleCard";
import PaginationWrapper from "@/app/ui/PaginationWrapper";

export default function PaginatedArticleCards({
  posts,
  userId,
  profileUsername,
  fetcherAndKind,
}: {
  posts: PostType[];
  userId?: string;
  profileUsername?: string;
  fetcherAndKind: PaginationFetcherAndKindType;
}) {
  const [postArr, setPostArr] = useState<PostType[]>(posts);
  return (
    <PaginationWrapper
      setMoreDataAction={setPostArr}
      id={userId}
      fetcherAndKind={fetcherAndKind}
    >
      {postArr.map((post) => (
        <ArticleCard
          key={post.id}
          article={{ author: profileUsername, ...post }}
        />
      ))}
    </PaginationWrapper>
  );
}
