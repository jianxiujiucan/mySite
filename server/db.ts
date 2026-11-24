import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const configured = Boolean(process.env.MYSQL_URL || process.env.MYSQL_HOST);

export const pool = configured
  ? process.env.MYSQL_URL
    ? mysql.createPool(process.env.MYSQL_URL)
    : mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "mysite",
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true,
      })
  : null;

let reportedFailure = false;

export async function databaseOrLocal<T>(
  query: () => Promise<T>,
  local: () => T,
): Promise<T> {
  if (!pool) return local();
  try {
    const result = await query();
    reportedFailure = false;
    return result;
  } catch (error) {
    if (!reportedFailure) {
      console.warn("MySQL is unavailable; using local demonstration content.");
      console.warn(error instanceof Error ? error.message : error);
      reportedFailure = true;
    }
    return local();
  }
}
