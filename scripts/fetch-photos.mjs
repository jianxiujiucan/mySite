import { mkdir, writeFile } from "node:fs/promises";

const photos = {
  "mountain-01.jpg": "photo-1501785888041-af3ef285b470",
  "mountain-02.jpg": "photo-1470770841072-f978cf4d019e",
  "mountain-03.jpg": "photo-1506744038136-46273834b3fb",
  "mountain-04.jpg": "photo-1519681393784-d120267933ba",
  "city-01.jpg": "photo-1449824913935-59a10b8d2000",
  "city-02.jpg": "photo-1444723121867-7a241cacace9",
  "city-03.jpg": "photo-1477959858617-67f85cf4f1df",
  "city-04.jpg": "photo-1480714378408-67cf0d13bc1b",
  "daily-01.jpg": "photo-1495474472287-4d71bcdd2085",
  "daily-02.jpg": "photo-1499750310107-5fef28a66643",
  "daily-03.jpg": "photo-1494438639946-1ebd1d20bf85",
  "daily-04.jpg": "photo-1455390582262-044cdead277a",
};

await mkdir("web/public/images/photos", { recursive: true });

for (const [filename, id] of Object.entries(photos)) {
  const url = `https://images.unsplash.com/${id}?fit=crop&w=1400&q=82`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`${filename}: ${type}`);
  await writeFile(
    `web/public/images/photos/${filename}`,
    Buffer.from(await response.arrayBuffer()),
  );
  console.log(`Saved ${filename}`);
}
