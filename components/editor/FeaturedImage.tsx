import Image from "next/image";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import { uploadImage } from "@/utils/uploadImage";

export default function FeaturedImage() {
  // const [imagePreview, setImagePreview] = useState("");
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer>("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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

      <div className="mt-4 w-fit">
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
            <p className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600">
              <FaImage className="size-5" />
              {imagePreview ? (
                <span>Change Cover</span>
              ) : (
                <span>Add Cover</span>
              )}
            </p>
          )}

          {/*<pre>{JSON.stringify(featuredImage, null, 4)}</pre>
          <p>{featuredImage}</p>*/}

          <input
            id="featuredImage"
            onChange={(e) => handleImageUpload(e)}
            type="file"
            accept="image/*"
            hidden
          />
          <input value={featuredImage} type="hidden" name="featuredImage" />
        </label>
      </div>
    </div>
  );
}
