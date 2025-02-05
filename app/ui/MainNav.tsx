"use client";

import Link from "next/link";
import ThemeSwitcher from "@/app/ui/ThemeSwitcher";
import { useRouter } from "next/navigation";
import { User } from "@/app/db/schema";
import { logoutUser } from "@/app/actions/auth";
import React from "react";

type MainNavProps = { user: Omit<User, "password"> | null };

export default function MainNav({ user }: MainNavProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow">
      <div className="flex justify-center space-x-4">
        <Link href="/">Home</Link>

        <button
          type="button"
          onClick={() =>
            user ? router.push("/write") : router.replace("/auth/sign-in")
          }
        >
          Write
        </button>
      </div>

      <div className="flex items-center justify-around space-x-4">
        {user ? (
          <div className="flex items-center space-x-2">
            <span className="">Hi, {user.name}</span>
            <button
              type="button"
              onClick={async (event) => {
                event.preventDefault();
                await logoutUser();
                router.refresh();
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <Link href="/auth/sign-in">Log in</Link>
        )}

        <ThemeSwitcher />
      </div>
    </nav>
  );
}
