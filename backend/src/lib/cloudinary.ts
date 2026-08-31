import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type MediaFolder = "product-images" | "hero-videos";

export async function uploadMedia(
  buffer: Buffer,
  mimetype: string,
  folder: MediaFolder
): Promise<string> {
  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `green-pi-enerji/${folder}`,
    resource_type: folder === "hero-videos" ? "video" : "image",
  });
  return result.secure_url;
}
