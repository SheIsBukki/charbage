"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import { uploadImage } from "@/utils/uploadImage";
import { deleteFeaturedImageEverywhere } from "@/lib/deleteFeaturedImageEverywhere";
import { FcRemoveImage } from "react-icons/fc";
import toast from "react-hot-toast";

export default function FeaturedImage({
  userId,
  updatedImageUrl,
}: {
  userId: string;
  updatedImageUrl: string;
}) {
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer>(
    updatedImageUrl || "",
  );
  const [featuredImage, setFeaturedImage] = useState(updatedImageUrl || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const handleImageUpload = async (event: any) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImagePreview(event.target?.result);
        localStorage.setItem("imagePreview", event.target.result);
      };

      reader.readAsDataURL(imageFile);
      setUploadingImage(true);
    }

    try {
      const imageUrl: any = await uploadImage(imageFile);
      localStorage.setItem("featuredImage", imageUrl);

      setFeaturedImage(imageUrl);
      setUploadingImage(false);
    } catch (error) {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    const storedImagePreview = localStorage.getItem("imagePreview");
    const storedImageUrl = localStorage.getItem("featuredImage");

    if (storedImagePreview) {
      setImagePreview(storedImagePreview);
    }

    if (storedImageUrl) {
      setFeaturedImage(storedImageUrl);
    }
  }, [setFeaturedImage, setImagePreview]);

  const handleRemoveImage = async (imgUrl: string, id: string) => {
    if (!imagePreview && !featuredImage) return;

    await deleteFeaturedImageEverywhere(imgUrl, id, "/write");
    setIsImageRemoved(true);
  };

  useEffect(() => {
    if (isImageRemoved) {
      localStorage.removeItem("imagePreview");
      localStorage.removeItem("featuredImage");
      setImagePreview("");
      setFeaturedImage("");
      setIsImageRemoved(false);
    }
  }, [isImageRemoved]);

  return (
    <div className="">
      {/*Selected Featured Image*/}
      {imagePreview && (
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
        {!featuredImage ? (
          <label
            htmlFor="featuredImage"
            className={`${uploadingImage && "disabled"}`}
          >
            {uploadingImage ? (
              <p className="flex w-fit items-center space-x-2 p-2">
                <BiLoaderAlt className="size-5 animate-spin" />
                <span>Uploading...</span>
              </p>
            ) : (
              <p className="rig-2 flex w-fit items-center space-x-2 rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 md:px-4 dark:bg-gray-800 dark:hover:bg-gray-600">
                <FaImage className="size-5" />
                <span className="">Add Cover</span>
              </p>
            )}

            <input
              id="featuredImage"
              onChange={(e) => handleImageUpload(e)}
              type="file"
              accept="image/*"
              hidden
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => handleRemoveImage(featuredImage, userId)}
            className="rng-2 flex w-fit items-center space-x-2 rounded-lg bg-gray-100 p-2 text-sm hover:bg-gray-200 md:px-4 dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <FcRemoveImage className="size-5" />
            <span className="">Remove cover</span>
          </button>
        )}
      </div>
      <input value={featuredImage} type="hidden" name="featuredImage" />
    </div>
  );
}
