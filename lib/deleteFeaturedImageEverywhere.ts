// "use server";

import { deleteFeaturedImage } from "@/db/queries/update";
import { destroyImage } from "@/utils/destroyImage";

export async function deleteFeaturedImageEverywhere(
  imageUrl: string,
  userId: string,
  path = "",
) {
  const regex = /(?<=charbage\/)\S.*(?=.jpg)/;
  const imagePublicId = imageUrl?.match(regex);

  try {
    if (imagePublicId) {
      await destroyImage(imagePublicId[0]);
    }

    await deleteFeaturedImage(imageUrl, userId);

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
