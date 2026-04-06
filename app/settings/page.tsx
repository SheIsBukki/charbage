import { getCurrentSession } from "@/lib/session";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SettingsPageClient from "@/app/settings/SettingsPageClient";
import { getProfileWithSlug } from "@/db/queries/select";
import ProfileSideBar from "@/components/profile/ProfileSideBar";

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

  return (
    <div className="boder mx-auto flex h-full w-full border-red-500">
      <ProfileSideBar currentUserProfile={profile} />

      <div className="m-1 h-full w-full rounded-lg border-2">
        <SettingsPageClient currentUser={user} profile={profile} />
      </div>
    </div>
  );
}
