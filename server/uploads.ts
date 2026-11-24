import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import multer from "multer";

const directory = resolve("uploads");
mkdirSync(directory, { recursive: true });

const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: directory,
    filename: (_request, file, callback) => {
      callback(null, `${Date.now()}-${randomUUID()}${extensions[file.mimetype]}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!extensions[file.mimetype]) {
      callback(new Error("仅支持 JPG、PNG、WebP、GIF 或 AVIF 图片"));
      return;
    }
    callback(null, true);
  },
});
