"use client";

import { useState } from "react";
import { clsx } from "clsx";
import ProfileForm from "@/components/profile/ProfileForm";
import { Profile, User } from "@/db/schema";
import {
  editAccountAction,
  editProfileAction,
} from "@/app/actions/profileActions";
import AccountSettings from "@/components/profile/AccountSettings";
import DangerZone from "@/components/profile/DangerZone";

export default function SettingsPageClient({
  currentUser,
  profile,
}: {
  currentUser: User;
  profile: Profile;
}) {
  const [view, setView] = useState("profileForm");

  const { github, linkedin } = JSON.parse(profile.socialLinks || "");
  const panelButtons = [
    { id: "profileForm", text: "Profile" },
    { id: "accountSettings", text: "Account" },
    { id: "dangerZone", text: "Danger Zone" },
  ];

  return (
    <div className="container mx-auto w-full space-y-4 p-4 lg:w-2/4">
      <div className="flex w-fit justify-between space-x-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-900">
        {panelButtons.map((panelButton) => (
          <button
            key={panelButton.id}
            onClick={() => setView(panelButton.id)}
            type="button"
            id={panelButton.id}
            className={clsx(
              "rounded-lg px-4 py-1 text-sm font-semibold ring-1 dark:ring-slate-800",
              {
                "text-gray-600 ring-slate-200 dark:text-gray-400":
                  panelButton.id !== view,
              },
            )}
          >
            {panelButton.text}
          </button>
        ))}
      </div>
      {view === "profileForm" && (
        // <div>
        <ProfileForm
          slug={profile.slug || ""}
          action={editProfileAction}
          values={{
            avatar: profile.avatar || "",
            bio: profile.bio || "",
            about: profile.about || "",
            firstname: profile.firstName || "",
            lastname: profile.lastName || "",
            github: github,
            linkedin: linkedin,
            profileId: profile.id,
          }}
        />
        // </div>
      )}

      {view === "accountSettings" && (
        <AccountSettings
          values={{
            username: currentUser.username,
            email: currentUser.email,
            userId: currentUser.id,
          }}
          action={editAccountAction}
        />
      )}
      {view === "dangerZone" && <DangerZone user={currentUser} />}
    </div>
  );
}
