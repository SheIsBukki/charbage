import { getUserWithOAuthEmail, registerUser } from "@/app/actions/auth";
import { google } from "@/app/lib/oauth";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/app/lib/session";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

interface Claims {name:string, email:string}

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
  const googleUserName = claims.name
  
  const existingUser = await getUserWithOAuthEmail(googleUserEmail)
  
  if(existingUser!==null){
    const sessionToken = await generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
  }
  
  const {user} = await registerUser(googleUserName, googleUserEmail)
  
  if(!user){
    return new Response(null,{status:404})
  }
  
  const sessionToken = await generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		await setSessionTokenCookie(sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
  
}


/** 
This might be helpful later...provided by Chat GPT

function isClaims(obj: any): obj is Claims {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.sub === 'string' &&
    (typeof obj.email === 'string' || obj.email === undefined) &&
    (typeof obj.name === 'string' || obj.name === undefined) &&
    (typeof obj.picture === 'string' || obj.picture === undefined)
  );
}

This comes after claims variable, not before
if (!isClaims(claims)) {
  return new Response(null, { status: 400, statusText: "Invalid claims structure" });
}

Example of Claims data 
{
  "sub": "1234567890",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://example.com/johndoe.jpg",
  "email": "johndoe@example.com",
  "email_verified": true,
  "locale": "en"
}
*/

/**
Some requested scopes were invalid. {valid=[https://www.googleapis.com/auth/userinfo.profile], invalid=[openId]} Learn more about this error
If you are a developer of Charbage, see error details.
Error 400: invalid_scope

Error 400: invalid_scope
Request details: flowName=GeneralOAuthFlow
*/