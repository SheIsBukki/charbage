import toast from "react-hot-toast";

export const destroyImage = async (imagePublicId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/api/cloudinary/destroy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: imagePublicId }),
      });

      if (!response.ok) {
        reject(new Error("Failed to destroy image"));
        toast.error("Failed to delete image from storage");
      } else {
        const data = await response.json();

        resolve(data.url);
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      reject(error);
    }
  });
};
