import { getCurrentSession } from "@/lib/session";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SettingsPageClient from "@/app/settings/SettingsPageClient";
import { getProfileWithSlug } from "@/db/queries/select";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Markdown editor with cool features",
};

export default async function SettingsPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }

  const { profile } = await getProfileWithSlug(`@${user.username}`);
  if (!profile) {
    return notFound();
  }

  return <SettingsPageClient currentUser={user} profile={profile} />;
}
