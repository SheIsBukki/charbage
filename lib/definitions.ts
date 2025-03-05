import { z } from "zod";

export const ArticleFormSchema = z.object({
  title: z
    .string()
    .min(20, { message: "Title must be at least 20 characters" }),
  content: z
    .string()
    .min(100, { message: "Content must be at least 100 characters" }),
  featuredImage: z
    .string()
    .url({ message: "Image should not exceed 10MB" })
    .optional(),
});

export const CommentFormSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Comment must be at least 5 characters" })
    .max(300, { message: "Comment cannot exceed 300 characters" }),
});

// This is for any user who wants to create a tag — using tags will simply fetch available tags for the user to select up to three from for a post
export const TagFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Tag name must be at least 2 characters" })
    .max(20, { message: "Tag name cannot exceed 10 characters" }),
  description: z
    .string()
    .min(5, { message: "Tag description must be at least 5 characters" })
    .max(100, { message: "Tag description cannot exceed 100 characters" }),
});

/**
 * tags: z
    .array(z.string().min(2, { message: "Tag must be at least 2 characters" }))
    .max(20, { message: "Tag cannot exceed 10 characters" })
    .optional(),
 * */

/** TAGs
 * id
 * title
 * description
 * */

/** COMMENTS — an array of objects
 * id
 * userId
 * content
 * */

/**
 *
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const SigninFormSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export type FormState =
  | {
    errors?: {
      name?: string[];
      email?: string[];
      password?: string[];
    }
    // message?: string;
    // }
    | undefined
  };
 * */
