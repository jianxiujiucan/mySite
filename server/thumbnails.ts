import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import sharp from "sharp";

export const THUMBNAIL_SIZE = 640;

export async function writeWebpThumbnail(
  input: string,
  output: string,
) {
  await mkdir(dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: 78 })
    .toFile(output);
}

export function uploadThumbnailPath(originalPath: string) {
  const extension = extname(originalPath);
  return extension
    ? originalPath.slice(0, -extension.length) + "-thumb.webp"
    : `${originalPath}-thumb.webp`;
}

export async function createUploadThumbnail(originalPath: string) {
  const output = uploadThumbnailPath(originalPath);
  await writeWebpThumbnail(originalPath, output);
  return `/uploads/${basename(output)}`;
}

export function storedThumbnail(src: string) {
  if (src.startsWith("/uploads/")) {
    const name = basename(src).replace(/\.[^.]+$/, "-thumb.webp");
    return existsSync(resolve("uploads", name)) ? `/uploads/${name}` : "";
  }

  if (src.startsWith("/images/photos/")) {
    const name = basename(src).replace(/\.[^.]+$/, ".webp");
    const relative = `/images/photos/thumbnails/${name}`;
    return existsSync(resolve(`web/public${relative}`)) ? relative : "";
  }

  return "";
}
