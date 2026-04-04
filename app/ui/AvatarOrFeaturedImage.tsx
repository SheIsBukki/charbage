"use client";

import { useEffect, useState } from "react";
import { uploadImage } from "@/utils/uploadImage";
import { BiLoaderAlt } from "react-icons/bi";
import { FcRemoveImage } from "react-icons/fc";
import { FaImage } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { deleteAvatarOrFeaturedImage } from "@/lib/deleteAvatarOrFeaturedImage";

export default function AvatarOrFeaturedImage({
  imageUrl,
  dynamicId,
}: {
  imageUrl: string;
  dynamicId: string;
}) {
  const [image, setImage] = useState(imageUrl || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer>(
    imageUrl || "",
  );

  const pathname = usePathname();

  const handleImageUpload = async (event: any) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImagePreview(event.target.result);
        if (pathname !== "/settings") {
          localStorage.setItem("imagePreview", event.target.result);
        }
      };

      reader.readAsDataURL(imageFile);
      setUploadingImage(true);
    }

    try {
      const uploadedImageUrl = await uploadImage(imageFile);
      if (pathname !== "/settings") {
        localStorage.setItem("featuredImage", uploadedImageUrl);
      }

      setImage(uploadedImageUrl);
      setUploadingImage(false);
    } catch (error) {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (pathname !== "/settings") {
      const storedImagePreview = localStorage.getItem("imagePreview");
      const storedImageUrl = localStorage.getItem("featuredImage");

      if (storedImagePreview) {
        setImagePreview(storedImagePreview);
      }

      if (storedImageUrl) {
        setImage(storedImageUrl);
      }
    }
  }, [setImage, setImagePreview]);

  const handleRemoveFeaturedImage = async (
    imageToDeleteUrl: string,
    requiredId: string,
  ) => {
    if (pathname !== "/settings" && !imagePreview && !image) {
      return;
    }

    await deleteAvatarOrFeaturedImage(
      imageToDeleteUrl,
      requiredId,
      pathname === "/settings" ? "/settings" : "/write",
    );

    setIsImageRemoved(true);
  };

  useEffect(() => {
    if (isImageRemoved) {
      if (pathname !== "/settings") {
        localStorage.removeItem("imagePreview");
        localStorage.removeItem("featuredImage");
      }
      setImagePreview("");
      setImage("");
      setIsImageRemoved(false);
    }
  }, [isImageRemoved]);

  return (
    <div className="space-y-2">
      {pathname === "/settings" && (
        <>
          <p className="font-semibold">Profile picture</p>
          <figure className="size-20 space-y-4 rounded-full ring-2 sm:size-24">
            <img
              src={`${imagePreview}` || "/avatar-default-svgrepo-com.svg"}
              alt="Profile avatar"
              className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)]"
            />
          </figure>
        </>
      )}

      {imagePreview && pathname !== "/settings" && (
        <figure className="relative size-full">
          <Image
            sizes="(min-width: 808px) 50vw, 100vw"
            width={0}
            height={0}
            src={`${imagePreview}`}
            alt="featured image"
            className="aspect-auto size-full rounded-lg object-contain"
          />
        </figure>
      )}

      <div className="mt-4">
        {!image ? (
          <label
            htmlFor={pathname === "/settings" ? "avatar" : "featuredImage"}
            className={`${uploadingImage && "disabled"}`}
          >
            {uploadingImage ? (
              <p className="">
                <BiLoaderAlt className="size-5 animate-spin" />
                <span className="">Uploading...</span>
              </p>
            ) : (
              <p className="flex w-fit items-center space-x-2 rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 md:px-4 dark:bg-gray-800 dark:hover:bg-gray-600">
                <FaImage className="size-5" />
                <span className="">
                  Add {pathname === "/settings" ? "avatar" : "cover"}
                </span>
              </p>
            )}

            <input
              id={pathname === "/settings" ? "avatar" : "featuredImage"}
              type="file"
              onChange={(e) => handleImageUpload(e)}
              className=""
              accept="image/*"
              hidden
            />
          </label>
        ) : (
          <button
            onClick={() => handleRemoveFeaturedImage(image, dynamicId)}
            type="button"
            className="flex w-fit items-center space-x-2 rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 md:px-4 dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <FcRemoveImage className="size-5" />
            <span className="">
              Remove {pathname === "/settings" ? "" : "cover"}
            </span>
          </button>
        )}
      </div>
      <input
        value={image}
        type="hidden"
        name={pathname === "/settings" ? "avatar" : "featuredImage"}
      />
    </div>
  );
}
