import { loginUser } from "@/app/actions/auth";
import SignIn from "@/app/components/auth/SignIn";
import { getCurrentSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  googleUserId: z.string(),
  githubUserId: z.number(),
});

export default async function SignInPage() {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/");
  }

  const action = async (prevState: any, formData: FormData) => {
    "use server";
    const parsed = SignInSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return { message: "Invalid email or password" };
    }

    const { email, password, githubUserId, googleUserId } = parsed.data;
    const { user, error } = await loginUser(
      email,
      password,
      githubUserId,
      googleUserId,
    );

    if (error) {
      return { message: error };
    } else if (user) {
      return redirect("/");
    }
  };

  return <SignIn action={action} />;
}
