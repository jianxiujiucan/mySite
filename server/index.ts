import cors from "cors";
import express, { type Request, type Response } from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { RowDataPacket } from "mysql2";
import { albums, calligraphyWorks, profile, projects } from "../shared/content.js";
import type {
  CalligraphyWork,
  PhotoAlbum,
  Profile,
  Project,
} from "../shared/types.js";
import { databaseOrLocal, pool } from "./db.js";
import adminRouter from "./admin.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(resolve("uploads")));
app.use("/api/admin", adminRouter);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, source: pool ? "mysql-or-local-fallback" : "local" });
});

app.get("/api/profile", async (_request, response) => {
  const data = await databaseOrLocal<Profile>(async () => {
    const [rows] = await pool!.query<RowDataPacket[]>(
      "SELECT name, english_name AS englishName, avatar, introduction FROM profile WHERE id = 1",
    );
    if (!rows[0]) return profile;
    return {
      name: rows[0].name,
      englishName: rows[0].englishName,
      avatar: rows[0].avatar,
      introduction: JSON.parse(rows[0].introduction),
    };
  }, () => profile);
  response.json(data);
});

app.get("/api/projects", async (_request, response) => {
  const data = await databaseOrLocal<Project[]>(async () => {
    const [rows] = await pool!.query<RowDataPacket[]>(
      `SELECT id, slug, title, english, summary, description, image, features,
              related_route AS relatedRoute, related_label AS relatedLabel
       FROM projects ORDER BY sort_order, id`,
    );
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      english: row.english,
      summary: row.summary,
      description: row.description,
      image: row.image,
      features: JSON.parse(row.features),
      relatedRoute: row.relatedRoute,
      relatedLabel: row.relatedLabel,
    }));
  }, () => projects);
  response.json(data);
});

app.get("/api/projects/:slug", async (request, response) => {
  const data = await databaseOrLocal<Project | null>(async () => {
    const [rows] = await pool!.query<RowDataPacket[]>(
      `SELECT id, slug, title, english, summary, description, image, features,
              related_route AS relatedRoute, related_label AS relatedLabel
       FROM projects WHERE slug = ? LIMIT 1`,
      [request.params.slug],
    );
    return rows[0]
      ? {
          id: rows[0].id,
          slug: rows[0].slug,
          title: rows[0].title,
          english: rows[0].english,
          summary: rows[0].summary,
          description: rows[0].description,
          image: rows[0].image,
          features: JSON.parse(rows[0].features),
          relatedRoute: rows[0].relatedRoute,
          relatedLabel: rows[0].relatedLabel,
        }
      : null;
  }, () => projects.find((project) => project.slug === request.params.slug) || null);
  sendOr404(response, data);
});

app.get("/api/albums", async (_request, response) => {
  const data = await databaseOrLocal<PhotoAlbum[]>(loadAlbums, () => albums);
  response.json(data);
});

app.get("/api/albums/:slug", async (request, response) => {
  const data = await databaseOrLocal<PhotoAlbum | null>(async () => {
    const data = await loadAlbums(request.params.slug);
    return data[0] || null;
  }, () => albums.find((album) => album.slug === request.params.slug) || null);
  sendOr404(response, data);
});

app.get("/api/calligraphy", async (_request, response) => {
  const data = await databaseOrLocal<CalligraphyWork[]>(async () => {
    const [rows] = await pool!.query<RowDataPacket[]>(
      "SELECT id, slug, title, src, alt, ratio, description FROM calligraphy_works ORDER BY sort_order, id",
    );
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      src: row.src,
      alt: row.alt,
      ratio: row.ratio,
      description: row.description || "",
    }));
  }, () => calligraphyWorks);
  response.json(data);
});

async function loadAlbums(slug?: string) {
  const [albumRows] = await pool!.query<RowDataPacket[]>(
    `SELECT id, slug, title, subtitle, description FROM photo_albums
     ${slug ? "WHERE slug = ?" : ""} ORDER BY sort_order, id`,
    slug ? [slug] : [],
  );
  const [photoRows] = await pool!.query<RowDataPacket[]>(
    `SELECT id, album_id AS albumId, src, alt, title, description,
            thumbnail_src AS thumbnailSrc FROM photos ORDER BY sort_order, id`,
  );
  return albumRows.map((album) => ({
    id: album.id,
    slug: album.slug,
    title: album.title,
    subtitle: album.subtitle,
    description: album.description || "",
    photos: photoRows
      .filter((photo) => photo.albumId === album.id)
      .map(({ id, src, alt, title, description, thumbnailSrc }) => ({
        id,
        src,
        alt,
        title,
        description: description || "",
        thumbnailSrc: thumbnailSrc || "",
      })),
  }));
}

function sendOr404(response: Response, data: unknown) {
  if (data === null) {
    response.status(404).json({ message: "Content not found" });
    return;
  }
  response.json(data);
}

app.use("/api", (_request, response) => {
  response.status(404).json({ message: "API route not found" });
});

const webDist = resolve("web/dist");
const adminDist = resolve("admin/dist");

if (existsSync(adminDist)) {
  app.use("/admin", express.static(adminDist));
  app.get("/admin/*", (_request: Request, response: Response) => {
    response.sendFile(resolve(adminDist, "index.html"));
  });
}

if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get("*", (request: Request, response: Response, next) => {
    if (request.path.startsWith("/api/")) return next();
    response.sendFile(resolve(webDist, "index.html"));
  });
}

app.listen(port, process.env.HOST || "127.0.0.1", () => {
  console.log(`Content API: http://localhost:${port}`);
  if (!pool) console.log("MySQL is not configured; serving shared local content.");
});
