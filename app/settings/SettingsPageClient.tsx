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
import ProfileSideBar from "@/components/profile/ProfileSideBar";

export default function SettingsPageClient({
  currentUser,
  profile,
}: {
  currentUser: User;
  profile: Profile;
}) {
  const [view, setView] = useState("profileForm");
  const [openMenu, setOpenMenu] = useState(false);

  const { github, linkedin } = JSON.parse(profile.socialLinks || "");
  const panelButtons = [
    { id: "profileForm", text: "Profile" },
    { id: "accountSettings", text: "Account" },
    { id: "dangerZone", text: "Danger Zone" },
  ];

  return (
    <div className="boder mx-auto flex w-full border-red-500">
      <ProfileSideBar
        openAction={openMenu}
        setOpenAction={setOpenMenu}
        currentUserProfile={profile}
      />

      {/*<div className="m-1 ms-20 h-full w-full rounded-lg border-2">*/}
      <div
        className={clsx(
          "bordr-2 m-1 w-full rounded-lg",
          openMenu
            ? "ms-0 md:ms-[28%] lg:ms-[14%]"
            : "ms-[16%] md:ms-[8%] lg:ms-[4%]",
        )}
      >
        <div className="borer container mx-auto h-full w-full space-y-4 border-red-500 p-4 pb-8 lg:w-3/6">
          <div className="flex w-fit justify-between space-x-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-900">
            {panelButtons.map((panelButton) => (
              <button
                key={panelButton.id}
                onClick={() => setView(panelButton.id)}
                type="button"
                id={panelButton.id}
                className={clsx(
                  "rounded-lg px-2 py-1 text-sm font-semibold ring-1 md:px-4 dark:ring-slate-800",
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
      </div>
    </div>
  );
}
