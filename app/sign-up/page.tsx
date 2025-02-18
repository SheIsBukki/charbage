import React from "react";
import { z } from "zod";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { loginUser, registerUser } from "@/app/actions/auth";
import SignUp from "@/components/auth/SignUp";

const SignUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
  // githubUserId: z.number(),
  // googleUserId: z.string(),
});

export default async function SignUpPage() {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/");
  }

  const action = async (prevState: any, formData: FormData) => {
    "use server";

    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return { message: "Invalid email or password" };
    }

    const { name, email, password } = parsed.data;
    const { user, error } = await registerUser(
      name,
      email,
      password,
      // githubUserId,
      // googleUserId,
    );

    if (error) {
      return { message: error };
    } else if (user) {
      await loginUser(email, password);
      return redirect("/");
    }
  };

  return <SignUp action={action} />;
}
