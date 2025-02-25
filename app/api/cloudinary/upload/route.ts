import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: "charbage",
});

export async function POST(req: Request) {
  const { image } = await req.json();

  try {
    const response = await cloudinary.uploader.upload(image, {
      folder: "charbage",
    });
    return NextResponse.json({ url: response.secure_url });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
