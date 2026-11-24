import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const sessions = new Map<string, number>();

function matches(actual: unknown, expected: string) {
  const left = createHash("sha256").update(String(actual || "")).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

function bearer(request: Request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export function adminLogin(request: Request, response: Response) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    response.status(503).json({ message: "后台尚未配置管理员密码" });
    return;
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  if (
    !matches(request.body?.username, username) ||
    !matches(request.body?.password, expectedPassword)
  ) {
    response.status(401).json({ message: "账号或密码不正确" });
    return;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  sessions.set(token, expiresAt);
  response.json({ token, expiresAt });
}

export function requireAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = bearer(request);
  const expiresAt = sessions.get(token);
  if (!token || !expiresAt || expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    response.status(401).json({ message: "登录已失效，请重新登录" });
    return;
  }
  next();
}

export function adminLogout(request: Request, response: Response) {
  sessions.delete(bearer(request));
  response.json({ ok: true });
}
