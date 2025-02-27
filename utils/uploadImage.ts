import Resizer from "react-image-file-resizer";
import toast from "react-hot-toast";

export const uploadImage = (file: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      1280,
      720,
      "JPEG",
      100,
      0,

      async (uri) => {
        try {
          const response = await fetch("/api/cloudinary/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: uri }),
          });

          if (!response.ok) {
            reject(new Error("Image upload failed"));
            toast.error("Image upload failed");
          } else {
            const data = await response.json();
            resolve(data.url);
            toast.success("Image upload successful");
            console.log(data.url);
          }
        } catch (error) {
          reject(error);
        }
      },
      "base64",
    );
  });
};
