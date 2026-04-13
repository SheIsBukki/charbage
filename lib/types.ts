import { Bookmark, Comment, Like } from "@/db/schema";
import { Dispatch, SetStateAction } from "react";

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

export type ReactionsType = {
  likes: Like[];
  comments: Comment[];
  bookmarks: Bookmark[];
} | null;

export type CommentFormValues = {
  comment: string;
  commentId?: string;
  oldComment?: string;
  userId?: string;
  postId?: string;
};

export type CommentActionState = {
  error: Record<string, { message: string }>;
  values: CommentFormValues;
  hasCommentChanged?: boolean;
  serverError?: boolean;
  isSubmitSuccessful?: boolean;
};

export type CommentFormProps = {
  action: (
    initialState: CommentActionState,
    formData: FormData,
  ) => Promise<CommentActionState>;
  values: CommentFormValues;
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

export type ProfileFormValues = {
  avatar: string;
  bio: string;
  about: string;
  firstname: string;
  lastname: string;
  github: string;
  linkedin: string;
  profileId: string;
};

export type ProfileActionStateType = {
  errors: Record<string, { message: string }>;
  values: ProfileFormValues;
  serverError?: boolean;
  isSubmitSuccessful?: boolean;
};

export type ProfileFormProps = {
  action: (
    initialState: ProfileActionStateType,
    formData: FormData,
  ) => Promise<ProfileActionStateType>;
  values: ProfileFormValues;
  slug: string;
};

export type UserAccountFormValues = {
  username: string;
  email: string;
  userId: string;
  // oldPassword: string;
  // newPassword: string;
};

export type UserAccountActionStateType = {
  errors: Record<string, { message: string }>;
  values: UserAccountFormValues;
  serverError?: boolean;
  isSubmitSuccessful?: boolean;
};

export type AccountSettingsFormProps = {
  action: (
    initialState: UserAccountActionStateType,
    formData: FormData,
  ) => Promise<UserAccountActionStateType>;
  values: UserAccountFormValues;
};

export type PostType = {
  author?: string;
  authorFirstname?: string | null;
  authorLastname?: string | null;
  authorAvatar?: string | null;
  id: string;
  title: string;
  description: string | null;
  content: string;
  featuredImage: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  comments?: number;
  likes?: number;
  bookmarks?: number;
};

export type currentUserBookmarksType = {
  title: string;
  postSlug: string;
  createdAt: Date;
  authorName: string;
  authorSlug: string;
  authorAvatar: string;
  updatedAt: Date | null;
};

export type userBookmarksType = {
  bookmarkId: string;
  totalBookmarks: number;
  title: string;
  postSlug: string;
  createdAt: Date;
  updatedAt: Date | null;
  authorSlug: string | null;
  authorFirstname: string | null;
  authorLastname: string | null;
  authorAvatar: string | null;
  authorUsername: string | null;
};
