import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import { github } from "@/lib/oauth";
import { getUserWithGithubData, registerUser } from "@/app/actions/auth";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();

  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;

  if (code === null || state === null || storedState === null) {
    return new Response(null, { status: 400 });
  }

  if (state !== storedState) {
    return new Response(null, { status: 400 });
  }

  let tokens: OAuth2Tokens;

  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` },
  });

  const githubUser = await githubUserResponse.json();
  const email = githubUser.email;
  const githubUserId = githubUser.id;
  const name = githubUser.login;

  const existingUser = await getUserWithGithubData(githubUserId);

  if (existingUser !== null) {
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, { status: 302, headers: { Location: "/" } });
  }

  const { user } = await registerUser(name, email, githubUserId);

  if (!user) {
    return new Response(null, { status: 404 });
  }

  /**
   * The next steps according to Lucia-auth are actually these:
   * */
  const sessionToken = await generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}

/**
  A simple way to complete the github signup and signin is to call the loginUser function because the loginUser function already has session code, and use the redirect() 
  await loginUser(githubUserEmail);
  return redirect("/");
  */
