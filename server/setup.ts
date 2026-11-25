import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { albums, calligraphyWorks, profile, projects } from "../shared/content.js";

dotenv.config();

const database = process.env.MYSQL_DATABASE || "mysite";
const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  multipleStatements: true,
});

try {
  await connection.query(await readFile("server/schema.sql", "utf8"));
  await connection.changeUser({ database });

  const additionalColumns = [
    ["photo_albums", "description", "TEXT NULL"],
    ["photos", "description", "TEXT NULL"],
    ["photos", "thumbnail_src", "VARCHAR(512) NULL"],
    ["calligraphy_works", "description", "TEXT NULL"],
  ] as const;

  for (const [table, column, definition] of additionalColumns) {
    const [columns] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [database, table, column],
    );
    if (!columns.length) {
      await connection.query(
        `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
      );
    }
  }

  await connection.query(
    "ALTER TABLE photos MODIFY COLUMN id INT UNSIGNED NOT NULL AUTO_INCREMENT",
  );

  await connection.execute(
    `INSERT INTO profile (id, name, english_name, avatar, introduction)
     VALUES (1, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE id = id`,
    [
      profile.name,
      profile.englishName,
      profile.avatar,
      JSON.stringify(profile.introduction),
    ],
  );

  for (const [index, project] of projects.entries()) {
    await connection.execute(
      `INSERT INTO projects
       (slug, title, english, summary, description, image, features, related_route, related_label, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`,
      [
        project.slug,
        project.title,
        project.english,
        project.summary,
        project.description,
        project.image,
        JSON.stringify(project.features),
        project.relatedRoute,
        project.relatedLabel,
        index,
      ],
    );
  }

  for (const [index, album] of albums.entries()) {
    await connection.execute(
      `INSERT INTO photo_albums (slug, title, subtitle, description, sort_order)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`,
      [album.slug, album.title, album.subtitle, album.description || "", index],
    );
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT id FROM photo_albums WHERE slug = ?",
      [album.slug],
    );
    const albumId = rows[0].id;
    for (const [photoIndex, photo] of album.photos.entries()) {
      await connection.execute(
        `INSERT INTO photos (id, album_id, src, alt, title, description, thumbnail_src, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id = id`,
        [
          photo.id,
          albumId,
          photo.src,
          photo.alt,
          photo.title,
          photo.description || "",
          photo.thumbnailSrc || "",
          photoIndex,
        ],
      );
      if (photo.thumbnailSrc) {
        await connection.execute(
          `UPDATE photos SET thumbnail_src = ?
           WHERE id = ? AND (thumbnail_src IS NULL OR thumbnail_src = '')`,
          [photo.thumbnailSrc, photo.id],
        );
      }
    }
  }

  for (const [index, work] of calligraphyWorks.entries()) {
    await connection.execute(
      `INSERT INTO calligraphy_works (slug, title, src, alt, ratio, description, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`,
      [work.slug, work.title, work.src, work.alt, work.ratio, work.description || "", index],
    );
  }

  console.log(`MySQL database "${database}" is ready.`);
} finally {
  await connection.end();
}
