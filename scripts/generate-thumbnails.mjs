import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { albums } from "../shared/content.js";
import {
  uploadThumbnailPath,
  writeWebpThumbnail,
} from "../server/thumbnails.js";

const force = process.argv.includes("--force");
let created = 0;
let skipped = 0;

async function generate(input, output) {
  if (!force && existsSync(output)) {
    skipped += 1;
    return;
  }
  await writeWebpThumbnail(input, output);
  created += 1;
  console.log(`Created ${output}`);
}

for (const album of albums) {
  for (const photo of album.photos) {
    if (!photo.thumbnailSrc) continue;
    await generate(
      resolve(`web/public${photo.src}`),
      resolve(`web/public${photo.thumbnailSrc}`),
    );
  }
}

const uploadDirectory = resolve("uploads");
if (existsSync(uploadDirectory)) {
  for (const name of await readdir(uploadDirectory)) {
    if (name.endsWith("-thumb.webp")) continue;
    if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(name)) continue;
    const input = resolve(uploadDirectory, name);
    if (!(await stat(input)).isFile()) continue;
    await generate(input, uploadThumbnailPath(input));
  }
}

console.log(`Thumbnails complete: ${created} created, ${skipped} already existed.`);
