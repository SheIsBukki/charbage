"use client";

import { useState } from "react";
import { FetcherAndKind, PostType } from "@/lib/types";
import ArticleCard from "@/components/articles/ArticleCard";
import PaginationWrapper from "@/app/ui/PaginationWrapper";
import { usePathname } from "next/navigation";

type FetchKind = "homepagePosts" | "postsByUser" | "currentUserBookmarks";

export default function PaginatedArticleCards({
  posts,
  // dataFetcherAction,
  userId,
  profileUsername,
  // fetchKind,
  fetcherAndKind,
}: {
  // dataFetcherAction: DataFetcherActionType;
  posts: PostType[];
  userId?: string;
  profileUsername?: string;
  // fetchKind: FetcherAndKind.fetchKind;
  fetcherAndKind: FetcherAndKind;
}) {
  const [postArr, setPostArr] = useState<PostType[]>(posts);
  const pathname = usePathname();
  return (
    <PaginationWrapper
      // dataFetcherAction={dataFetcherAction}
      // dataExtractorName="posts"
      setMoreDataAction={setPostArr}
      id={userId}
      // fetchKind={fetchKind}
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
