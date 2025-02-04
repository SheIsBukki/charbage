/**
 *
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        let user = null;

        const pwHash = saltAndHashPassword(credentials.password);

        user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email_verified && profile.email?.endsWith(searchString);
      }
    },
  },
});
 * */
