import { getUserWithGoogleData, registerUser } from "@/app/actions/auth";
import { google } from "@/lib/oauth";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/session";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

interface Claims {
  name: string;
  email: string;
  sub: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();

  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, { status: 400 });
  }

  if (state !== storedState) {
    return new Response(null, { status: 400 });
  }

  let tokens: OAuth2Tokens;

  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    return new Response(null, { status: 400 });
  }

  const claims = decodeIdToken(tokens.idToken()) as Claims;
  const googleUserEmail = claims.email;
  // const googleUserId = claims.sub;
  const name = claims.name;

  const existingUser = await getUserWithGoogleData(googleUserEmail);

  if (existingUser !== null) {
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const { user } = await registerUser(name, googleUserEmail);

  if (!user) {
    return new Response(null, { status: 404 });
  }

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
