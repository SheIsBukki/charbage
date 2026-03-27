// export type PostDataType = {
//   posts: PostType | null;
//   error: null | string;
// };

import { Bookmark, Like, Comment } from "@/db/schema";
import { Dispatch, SetStateAction } from "react";

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

export type CommentFormValue = {
  comment: string;
  commentId?: string;
  oldComment?: string;
  userId?: string;
  postId?: string;
};

export type CommentActionState = {
  error: Record<string, { message: string }>;
  value: CommentFormValue;
  hasCommentChanged?: boolean;
  serverError?: boolean;
  isSubmitSuccessful?: boolean;
};

export type CommentFormProps = {
  action: (
    initialState: CommentActionState,
    formData: FormData,
  ) => Promise<CommentActionState>;
  value: CommentFormValue;
  setOpenSettings?: Dispatch<SetStateAction<boolean>>;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  currentUser?: string;
};

export type OldValues = {
  postId: string;
  featuredImage?: string;
  description?: string;
  slug: string;
  title: string;
  content: string;
};

export type PostFormValues = {
  title: string;
  description: string;
  content: string;
  featuredImage: string;
  slug?: string;
  postId?: string;
};

export type PostActionStateType = {
  errors: Record<string, { message: string }>;
  values: PostFormValues;
  serverError?: boolean;
  hasPostChanged?: boolean;
  isSubmitSuccessful?: boolean;
};
