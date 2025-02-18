"use server";

import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { User, userTable } from "@/db/schema";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/session";

export const hashPassword = async (password: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
};

export const verifyPassword = async (password: string, hash: string) => {
  const passwordHash = await hashPassword(password);

  return passwordHash === hash;
};

export const registerUser = async (
  name: string,
  email: string,
  password?: string,
  // githubUserId?: number,
  // googleUserId?: string,
) => {
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  try {
    const [user] = await db
      .insert(userTable)
      .values({
        name,
        email,
        password: hashedPassword,
        // githubUserId,
        // googleUserId,
      })
      .returning()
      .execute();

    const safeUser = { ...user, hashedPassword: undefined };

    return { user: safeUser, error: null };
  } catch (error) {
    console.error("Error registering user:", error);
    return { user: null, error: "Failed to register user" };
  }
};

export const loginUser = async (email: string, password?: string) => {
  /**REMEMBER TO REMOVE THIS IF CHECK FOR PRODUCTION*/
  // if (!db) {
  //   console.warn("Database not available: skipping user login");
  //   return { user: null };
  // }

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    return { user: null, error: "User not found" };
  }

  // Add the following two if statements to avoid sending null password to the database
  // This if statement checks if the user has a password set—Handles case for OAuth users
  if (user.password === null) {
    return { user: null, error: "No password set for this account" };
  }

  // This if statement checks if a password is provided—handles case where password is required
  if (password === null) {
    return { user: null, error: "Password is required" };
  }

  const passwordValid = await verifyPassword(password!, user.password);

  if (!passwordValid) {
    return { user: null, error: "Invalid password" };
  }

  const token = await generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);

  const safeUser = { ...user, hashedPassword: undefined };

  return { user: safeUser, error: null };
};

export const logoutUser = async () => {
  const session = await getCurrentSession();

  if (session.session?.id) {
    await invalidateSession(session.session.id);
  }

  await deleteSessionTokenCookie();
};

/**
 *  query to see if a user signed up through github or google oauth
 * */
export const getUserWithGithubData = async (
  githubUserId: number,
  githubUserEmail: string,
): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(
      and(
        eq(userTable.githubUserId, githubUserId),
        eq(userTable.email, githubUserEmail),
      ),
    )
    .execute();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    githubUserId: user.githubUserId,
    googleUserId: user.googleUserId,
    password: user.password,
    createdAt: user.createdAt,
  };
};

export const getUserWithGoogleData = async (
  googleUserId: string,
  googleUserEmail: string,
): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(
      and(
        eq(userTable.googleUserId, googleUserId),
        eq(userTable.email, googleUserEmail),
      ),
    )
    .execute();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    githubUserId: user.githubUserId,
    googleUserId: user.googleUserId,
    password: user.password,
    createdAt: user.createdAt,
  };
};
