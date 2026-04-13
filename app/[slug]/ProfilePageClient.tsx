"use client";

import { useState } from "react";
import { clsx } from "clsx";
import ProfileSideBar from "@/components/profile/ProfileSideBar";
import BioCard from "@/components/profile/BioCard";
import AboutCard from "@/components/profile/AboutCard";
import PaginatedArticleCards from "@/components/articles/PaginatedArticleCards";
import { getPostsByUser } from "@/db/queries/select";
import { DbUserPostsFetchType, PostType } from "@/lib/types";
import { Profile } from "@/db/schema";
import NoUserContent from "@/app/ui/NoUserContent";

export default function ProfilePageClient({
  postArr,
  currentUserProfile,
  profileInView,
}: {
  postArr: PostType[];
  currentUserProfile: Profile | undefined;
  profileInView: Profile;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      {currentUserProfile && (
        <ProfileSideBar
          currentUserProfile={currentUserProfile}
          setOpenAction={setOpenMenu}
          openAction={openMenu}
        />
      )}

      <div
        className={clsx(
          "borer-2 m-1 h-full w-full rounded-lg border-b-0",
          !currentUserProfile
            ? "ms-0"
            : !openMenu && currentUserProfile
              ? "ms-[16%] md:ms-[8%] lg:ms-[4%]"
              : "ms-0 md:ms-[28%] lg:ms-[14%]",
        )}
      >
        <div className="boder-2 mx-auto w-full space-y-4 border-red-500 py-4 lg:w-3/5">
          {/*BIO CARD*/}
          <BioCard {...profileInView} />
          <div className="p4 space-y-4 lg:grid lg:grid-cols-6 lg:gap-8 lg:space-y-0">
            {/*ABOUT CARD*/}
            <div className="col-span-2">
              <AboutCard
                about={profileInView.about || "/avatar-default-svgrepo-com.svg"}
              />
            </div>

            {/*RECENTLY PUBLISHED*/}
            <div className="col-span-4">
              <p className="mb-4 px-8 text-xl font-semibold md:px-4">
                Recently published
              </p>
              {postArr.length > 0 ? (
                <PaginatedArticleCards
                  profileUsername={profileInView?.slug?.slice(1)}
                  posts={postArr}
                  userId={profileInView.userId}
                  fetcherAndKind={{
                    kind: "postsByUser",
                    fetcher: getPostsByUser as DbUserPostsFetchType,
                  }}
                />
              ) : (
                <NoUserContent
                  nameOfUser={
                    profileInView.firstName || profileInView?.slug?.slice(1)
                  }
                  content={"posts"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
