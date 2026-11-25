import { Router, type NextFunction, type Request, type Response } from "express";
import { unlink } from "node:fs/promises";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { adminLogin, adminLogout, requireAdmin } from "./auth.js";
import { pool } from "./db.js";
import { uploadImage } from "./uploads.js";
import { createUploadThumbnail, storedThumbnail } from "./thumbnails.js";

const router = Router();

class InputError extends Error {}

function text(value: unknown, label: string, required = true) {
  const result = String(value ?? "").trim();
  if (required && !result) throw new InputError(`请填写${label}`);
  if (result.length > 5000) throw new InputError(`${label}内容过长`);
  return result;
}

function imageUrl(value: unknown) {
  const result = text(value, "图片地址");
  if (result.length > 512) throw new InputError("图片地址不能超过 512 个字符");
  if (result.startsWith("/")) return result;
  try {
    const url = new URL(result);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return url.toString();
  } catch {
    throw new InputError("图片地址需使用 http(s) 外链或本地上传路径");
  }
}

function slug(value: unknown) {
  const result = text(value, "标识");
  if (!/^[\p{L}\p{N}][\p{L}\p{N}-]*$/u.test(result)) {
    throw new InputError("标识仅支持文字、字母、数字和连字符");
  }
  return result;
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
}

function asyncRoute(
  handler: (request: Request, response: Response) => Promise<void>,
) {
  return (request: Request, response: Response, next: NextFunction) => {
    handler(request, response).catch(next);
  };
}

async function nextSort(table: string) {
  const [rows] = await pool!.query<RowDataPacket[]>(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM \`${table}\``,
  );
  return Number(rows[0].next);
}

async function loadContent() {
  const [profileRows] = await pool!.query<RowDataPacket[]>(
    "SELECT name, english_name AS englishName, avatar, introduction FROM profile WHERE id = 1",
  );
  const [projectRows] = await pool!.query<RowDataPacket[]>(
    `SELECT id, slug, title, english, summary, description, image, features,
            related_route AS relatedRoute, related_label AS relatedLabel
     FROM projects ORDER BY sort_order, id`,
  );
  const [albumRows] = await pool!.query<RowDataPacket[]>(
    "SELECT id, slug, title, subtitle, description FROM photo_albums ORDER BY sort_order, id",
  );
  const [photoRows] = await pool!.query<RowDataPacket[]>(
    `SELECT id, album_id AS albumId, src, alt, title, description,
            thumbnail_src AS thumbnailSrc
     FROM photos ORDER BY sort_order, id`,
  );
  const [workRows] = await pool!.query<RowDataPacket[]>(
    "SELECT id, slug, title, src, alt, ratio, description FROM calligraphy_works ORDER BY sort_order, id",
  );

  return {
    profile: profileRows[0]
      ? {
          name: profileRows[0].name,
          englishName: profileRows[0].englishName,
          avatar: profileRows[0].avatar,
          introduction: JSON.parse(profileRows[0].introduction),
        }
      : { name: "", englishName: "", avatar: "", introduction: [] },
    projects: projectRows.map((row) => ({
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
    })),
    albums: albumRows.map((album) => ({
      id: album.id,
      slug: album.slug,
      title: album.title,
      subtitle: album.subtitle,
      description: album.description || "",
      photos: photoRows
        .filter((photo) => photo.albumId === album.id)
        .map((photo) => ({
          id: photo.id,
          albumId: photo.albumId,
          src: photo.src,
          alt: photo.alt,
          title: photo.title,
          description: photo.description || "",
          thumbnailSrc: photo.thumbnailSrc || "",
        })),
    })),
    calligraphy: workRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      src: row.src,
      alt: row.alt,
      ratio: row.ratio,
      description: row.description || "",
    })),
  };
}

function projectValues(body: Record<string, unknown>) {
  return [
    slug(body.slug),
    text(body.title, "项目名称"),
    text(body.english, "英文名称"),
    text(body.summary, "项目摘要"),
    text(body.description, "项目详情"),
    imageUrl(body.image),
    JSON.stringify(stringList(body.features)),
    text(body.relatedRoute, "关联链接"),
    text(body.relatedLabel, "链接文字"),
  ];
}

function albumValues(body: Record<string, unknown>) {
  return [
    slug(body.slug),
    text(body.title, "相册标题"),
    text(body.subtitle, "相册副标题", false),
    text(body.description, "相册详情", false),
  ];
}

function photoValues(body: Record<string, unknown>) {
  const src = imageUrl(body.src);
  return [
    src,
    text(body.alt, "图片描述"),
    text(body.title, "图片标题"),
    text(body.description, "图片详情", false),
    storedThumbnail(src),
  ];
}

function workValues(body: Record<string, unknown>) {
  return [
    slug(body.slug),
    text(body.title, "作品标题"),
    imageUrl(body.src),
    text(body.alt, "图片描述"),
    text(body.ratio || "4 / 5", "图片比例"),
    text(body.description, "作品详情", false),
  ];
}

router.post("/login", adminLogin);
router.post("/logout", requireAdmin, adminLogout);
router.use(requireAdmin);
router.use((_request, response, next) => {
  if (!pool) {
    response.status(503).json({ message: "请先配置 MySQL，再使用内容后台" });
    return;
  }
  next();
});

router.get("/session", (_request, response) => response.json({ ok: true }));
router.get("/content", asyncRoute(async (_request, response) => {
  response.json(await loadContent());
}));

router.post(
  "/uploads",
  uploadImage.single("image"),
  asyncRoute(async (request, response) => {
    if (!request.file) throw new InputError("请选择要上传的图片");
    try {
      const thumbnailUrl = await createUploadThumbnail(request.file.path);
      response.status(201).json({
        url: `/uploads/${request.file.filename}`,
        thumbnailUrl,
      });
    } catch {
      await unlink(request.file.path).catch(() => undefined);
      throw new InputError("图片处理失败，请换一张有效的图片后重试");
    }
  }),
);

router.put("/profile", asyncRoute(async (request, response) => {
  const name = text(request.body.name, "名字");
  const englishName = text(request.body.englishName, "英文名字");
  const avatar = imageUrl(request.body.avatar);
  const introduction = stringList(request.body.introduction);
  if (!introduction.length) throw new InputError("请填写简介内容");
  await pool!.execute(
    `INSERT INTO profile (id, name, english_name, avatar, introduction)
     VALUES (1, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), english_name = VALUES(english_name),
       avatar = VALUES(avatar), introduction = VALUES(introduction)`,
    [name, englishName, avatar, JSON.stringify(introduction)],
  );
  response.json({ ok: true });
}));

router.post("/projects", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    `INSERT INTO projects
     (slug, title, english, summary, description, image, features, related_route, related_label, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [...projectValues(request.body), await nextSort("projects")],
  );
  response.status(201).json({ id: result.insertId });
}));

router.put("/projects/:id", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    `UPDATE projects SET slug = ?, title = ?, english = ?, summary = ?, description = ?,
       image = ?, features = ?, related_route = ?, related_label = ? WHERE id = ?`,
    [...projectValues(request.body), Number(request.params.id)],
  );
  if (!result.affectedRows) response.status(404).json({ message: "项目不存在" });
  else response.json({ ok: true });
}));

router.delete("/projects/:id", asyncRoute(async (request, response) => {
  await pool!.execute("DELETE FROM projects WHERE id = ?", [Number(request.params.id)]);
  response.json({ ok: true });
}));

router.post("/albums", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    "INSERT INTO photo_albums (slug, title, subtitle, description, sort_order) VALUES (?, ?, ?, ?, ?)",
    [...albumValues(request.body), await nextSort("photo_albums")],
  );
  response.status(201).json({ id: result.insertId });
}));

router.put("/albums/:id", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    "UPDATE photo_albums SET slug = ?, title = ?, subtitle = ?, description = ? WHERE id = ?",
    [...albumValues(request.body), Number(request.params.id)],
  );
  if (!result.affectedRows) response.status(404).json({ message: "相册不存在" });
  else response.json({ ok: true });
}));

router.delete("/albums/:id", asyncRoute(async (request, response) => {
  await pool!.execute("DELETE FROM photo_albums WHERE id = ?", [Number(request.params.id)]);
  response.json({ ok: true });
}));

router.post("/albums/:id/photos", asyncRoute(async (request, response) => {
  const albumId = Number(request.params.id);
  const [result] = await pool!.execute<ResultSetHeader>(
    `INSERT INTO photos (album_id, src, alt, title, description, thumbnail_src, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [albumId, ...photoValues(request.body), await nextSort("photos")],
  );
  response.status(201).json({ id: result.insertId });
}));

router.put("/photos/:id", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    `UPDATE photos SET album_id = ?, src = ?, alt = ?, title = ?, description = ?, thumbnail_src = ? WHERE id = ?`,
    [Number(request.body.albumId), ...photoValues(request.body), Number(request.params.id)],
  );
  if (!result.affectedRows) response.status(404).json({ message: "图片不存在" });
  else response.json({ ok: true });
}));

router.delete("/photos/:id", asyncRoute(async (request, response) => {
  await pool!.execute("DELETE FROM photos WHERE id = ?", [Number(request.params.id)]);
  response.json({ ok: true });
}));

router.post("/calligraphy", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    `INSERT INTO calligraphy_works (slug, title, src, alt, ratio, description, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [...workValues(request.body), await nextSort("calligraphy_works")],
  );
  response.status(201).json({ id: result.insertId });
}));

router.put("/calligraphy/:id", asyncRoute(async (request, response) => {
  const [result] = await pool!.execute<ResultSetHeader>(
    `UPDATE calligraphy_works SET slug = ?, title = ?, src = ?, alt = ?, ratio = ?, description = ? WHERE id = ?`,
    [...workValues(request.body), Number(request.params.id)],
  );
  if (!result.affectedRows) response.status(404).json({ message: "作品不存在" });
  else response.json({ ok: true });
}));

router.delete("/calligraphy/:id", asyncRoute(async (request, response) => {
  await pool!.execute("DELETE FROM calligraphy_works WHERE id = ?", [Number(request.params.id)]);
  response.json({ ok: true });
}));

router.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof InputError) {
    response.status(400).json({ message: error.message });
    return;
  }
  if (error && typeof error === "object" && "code" in error) {
    if (error.code === "ER_DUP_ENTRY") {
      response.status(409).json({ message: "标识或图片地址已存在，请更换后再保存" });
      return;
    }
    if (String(error.code).startsWith("LIMIT_")) {
      response.status(400).json({ message: "图片不能超过 8MB，且每次只能上传一张" });
      return;
    }
  }
  if (error instanceof Error && error.message.includes("仅支持")) {
    response.status(400).json({ message: error.message });
    return;
  }
  console.error(error);
  response.status(500).json({ message: "保存失败，请稍后重试" });
});

export default router;
