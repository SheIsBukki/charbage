// export type PostDataType = {
//   posts: PostType | null;
//   error: null | string;
// };

import { Bookmark, Like, Comment } from "@/db/schema";

export type ReactionCountType = {
  comments: number;
  bookmarks: number;
  likes: number;
} | null;

export type DbActionType = (id: string) => Promise<
  | {
      error: string;
      result: null;
    }
  | {
      result: string;
      error: null;
    }
>;

export type DbActionReturnType =
  | {
      error: string;
      result: null;
    }
  | {
      result: string;
      error: null;
    };

export type ReactionsType = {
  likes: Like[];
  comments: Comment[];
  bookmarks: Bookmark[];
} | null;
