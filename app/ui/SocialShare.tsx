import { useEffect, useState } from "react";
import { MdOutlineAddLink } from "react-icons/md";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import { clsx } from "clsx";
import { copyCurrentUrl } from "@/utils/helpers";

export default function SocialShare({
  openShareMenu,
  slug,
  shortText,
  postOrProfile,
}: {
  openShareMenu: boolean;
  slug: string;
  shortText: string;
  postOrProfile: "post" | "profile";
}) {
  const [copyUrl, setCopyUrl] = useState(false);

  useEffect(() => {
    if (copyUrl) {
      copyCurrentUrl().then((r) => console.log(r));
    }

    const timeoutId = setTimeout(() => setCopyUrl(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [copyUrl]);

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://charbage.netlify.app";

  const shareUrl = `${url}/${slug}`;

  const socials = [
    {
      socialEl: (
        <WhatsappShareButton
          url={shareUrl || ""}
          title={shortText || ""}
          separator=":: "
          blankTarget={true}
        >
          <p className="boder flex items-center space-x-3 border-red-500">
            <WhatsappIcon className="size-6 md:size-8" round />{" "}
            <span className="">Share on Whatsapp</span>
          </p>
        </WhatsappShareButton>
      ),
      text: "WhatsApp",
    },
    {
      socialEl: (
        <LinkedinShareButton url={shareUrl || ""} title={shortText || ""}>
          <p className="boder flex items-center space-x-3 border-red-500">
            <LinkedinIcon className="size-6 md:size-8" round />
            <span className="">Share on LinkedIn</span>
          </p>
        </LinkedinShareButton>
      ),
      text: "Linkedin",
    },
    {
      socialEl: (
        <TwitterShareButton url={shareUrl || ""} title={shortText || ""}>
          <p className="brder flex items-center space-x-3 border-red-500">
            <TwitterIcon className="size-6 md:size-8" round />
            <span className="">Share on Twitter</span>
          </p>
        </TwitterShareButton>
      ),
      text: "Twitter",
    },
    {
      socialEl: (
        <RedditShareButton url={shareUrl || ""} title={shortText || ""}>
          <p className="brder flex items-center space-x-3 border-red-500">
            <RedditIcon className="size-6 md:size-8" round />
            <span className="">Share on Reddit</span>
          </p>
        </RedditShareButton>
      ),
      text: "Reddit",
    },
    {
      socialEl: (
        <FacebookShareButton
          url={shareUrl || ""}
          hashtag={"#Charbage"}
          quote={shortText || ""}
        >
          <p className="brder flex items-center space-x-3 border-red-500">
            <FacebookIcon className="size-6 md:size-8" round />
            <span className="">Share on Facebook</span>
          </p>
        </FacebookShareButton>
      ),
      text: "Facebook",
    },
    {
      socialEl: (
        <EmailShareButton
          url={shareUrl || ""}
          body="body"
          subject={shortText || ""}
        >
          <p className="brder flex items-center space-x-3 border-red-500">
            <EmailIcon className="size-6 md:size-8" round />
            <span className="">Share on Email</span>
          </p>
        </EmailShareButton>
      ),
      text: "Email",
    },
  ];

  return (
    <>
      {openShareMenu && (
        <ul
          className={clsx(
            "absolute z-30 space-y-2 rounded-md border-2 bg-gray-50 p-1 text-sm dark:bg-gray-900",
            postOrProfile === "post"
              ? "bottom-20 right-0 md:left-44 md:right-auto lg:bottom-auto lg:left-24 lg:top-56 lg:w-fit"
              : "right-0 top-28 shadow-2xl md:top-16",
          )}
        >
          <li className="w-full list-none px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            <button
              type="button"
              onClick={() => setCopyUrl(true)}
              className="flex items-center space-x-3"
            >
              <MdOutlineAddLink
                className={clsx(
                  "size-6 md:size-8",
                  copyUrl && "text-purple-500",
                )}
              />
              <span className="">
                Copy {postOrProfile === "post" ? "link" : "profile URL"}
              </span>
            </button>
          </li>
          {socials.map(({ socialEl, text }) => (
            <li
              key={text}
              className="w-full list-none px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {socialEl}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
