// export type PostDataType = {
//   posts: PostType | null;
//   error: null | string;
// };

export type ReactionCountType = {
  comments: number;
  bookmarks: number;
  likes: number;
} | null;

export type DeletePostActionType = (id: string) => Promise<
  | {
      error: string;
      result: null;
    }
  | {
      result: string;
      error: null;
    }
>;
