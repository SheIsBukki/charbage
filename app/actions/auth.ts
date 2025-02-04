"use server";

import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { eq } from "drizzle-orm";
import { db } from "@/app/db";
import { User, userTable } from "@/app/db/schema";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/app/lib/session";

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
) => {
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  try {
    const [user] = await db
      .insert(userTable)
      .values({ name, email, password: hashedPassword })
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
export const getUserWithOAuthEmail = async (
  oauthUserEmail: string,
): Promise<User | null> => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, oauthUserEmail))
    .execute();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    createdAt: user.createdAt,
  };
};
