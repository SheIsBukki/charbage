// "use server";

import { deleteFeaturedImage, removeAvatar } from "@/db/queries/update";
import { destroyImage } from "@/utils/destroyImage";

export async function deleteAvatarOrFeaturedImage(
  imageUrl: string,
  id: string,
  path = "",
) {
  const regex = /(?<=charbage\/)\S.*(?=.jpg)/;
  const imagePublicId = imageUrl?.match(regex);

  try {
    if (imagePublicId) {
      await destroyImage(imagePublicId[0], path);
    }

    if (path !== "/settings") {
      await deleteFeaturedImage(imageUrl, id);
    } else if (path === "/settings") {
      await removeAvatar(id);
    }

    if (path === "/write") {
      // const response =
      await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
        method: "GET",
      });

      // const data = await response.json();
      // console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}
