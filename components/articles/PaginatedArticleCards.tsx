"use client";

import { useState } from "react";
import { PostType } from "@/lib/types";
import ArticleCard from "@/components/articles/ArticleCard";
import PaginationWrapper from "@/app/ui/PaginationWrapper";

export default function PaginatedArticleCards({
  posts,
  dataFetcherAction,
  userId,
  profileUsername,
}: {
  dataFetcherAction: Function;
  posts: PostType[];
  userId?: string;
  profileUsername?: string;
}) {
  const [postArr, setPostArr] = useState<PostType[]>(posts);
  return (
    <PaginationWrapper
      dataFetcherAction={dataFetcherAction}
      dataExtractorName="posts"
      setMoreDataAction={setPostArr}
      userId={userId}
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
