"use server";

import {
  UserAccountActionStateType,
  UserAccountFormValues,
  ProfileActionStateType,
  ProfileFormValues,
} from "@/lib/types";
import { ProfileFormSchema } from "@/lib/definitions";
import { updateProfile, updateUserAccount } from "@/db/queries/update";

export const editProfileAction = async (
  initialState: ProfileActionStateType,
  formData: FormData,
) => {
  const values: ProfileFormValues = {
    profileId: String(formData.get("profileId")),
    avatar: String(formData.get("avatar") || ""),
    bio: String(formData.get("bio") || ""),
    about: String(formData.get("about") || ""),
    firstname: String(formData.get("firstname") || ""),
    lastname: String(formData.get("lastname") || ""),
    github: String(formData.get("github") || ""),
    linkedin: String(formData.get("linkedin") || ""),
  };

  const { error: parseError } = ProfileFormSchema.safeParse(values);
  const errors: ProfileActionStateType["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  let serverError = false;
  let isSubmitSuccessful;

  const updatedProfile = await updateProfile(values.profileId, values);
  if (updatedProfile.result) {
    isSubmitSuccessful = true;
  }

  if (updatedProfile.error) {
    serverError = true;
  }

  return { values, errors: {}, serverError: serverError, isSubmitSuccessful };
};

export const editAccountAction = async (
  initialState: UserAccountActionStateType,
  formData: FormData,
) => {
  const values: UserAccountFormValues = {
    username: String(formData.get("username")),
    email: String(formData.get("email")),
    userId: String(formData.get("userId")),
  };

  const { error: parseError } = ProfileFormSchema.safeParse(values);
  const errors: ProfileActionStateType["errors"] = {};

  for (const { path, message } of parseError?.issues || []) {
    errors[path.join(".")] = { message };
  }

  let serverError = false;
  let isSubmitSuccessful;

  const updatedAccount = await updateUserAccount(values.userId, values);

  if (updatedAccount.error) {
    serverError = true;
  }

  if (updatedAccount.result) {
    isSubmitSuccessful = true;
  }

  return {
    values,
    errors: {},
    serverError: serverError,
    isSubmitSuccessful: isSubmitSuccessful,
  };
};
