"use server";

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { publicId } = await req.json();

  try {
    const response = await cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_FOLDER_NAME}/${publicId}`,
      {
        invalidate: true,
      },
    );

    return NextResponse.json({ url: response.secure_url });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
