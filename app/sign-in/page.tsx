import { loginUser } from "@/app/actions/auth";
import SignIn from "@/components/auth/SignIn";
import { getCurrentSession } from "@/lib/session";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  // googleUserId: z.string(),
  // githubUserId: z.number(),
});

const signInAction = async (prevState: any, formData: FormData) => {
  "use server";
  const parsed = SignInSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { message: "Invalid email or password" };
  }

  const { email, password } = parsed.data;

  const { user, error } = await loginUser(
    email,
    password,
    // githubUserId,
    // googleUserId,
  );

  if (error) {
    return { message: error };
  } else if (user) {
    return { successful: true };
  }
};

export default async function SignInPage() {
  const { user } = await getCurrentSession();

  return (
    <>
      <SignIn userAlreadyLoggedIn={!!user} signInAction={signInAction} />
    </>
  );
}
