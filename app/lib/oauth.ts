import { GitHub, Google } from "arctic";

/** GitHub OAuth*/
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error(
    "Missing GITHUB_CLIENT_ID or/and GITHUB_CLIENT_SECRET environment variables",
  );
}

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  null,
);

/** Google OAuth*/
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID or/and GOOGLE_CLIENT_SECRET environment variables",
  );
}

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://charbage.netlify.app/auth/google/callback", // Production
  // "http://localhost:3000/auth/google/callback", // Development
);
