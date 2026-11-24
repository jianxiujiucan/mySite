import { computed, ref } from "vue";
import type {
  CalligraphyWork,
  Photo,
  PhotoAlbum,
  Profile,
  Project,
} from "@shared/types";

export type AdminProject = Project & { id: number };
export type AdminPhoto = Photo & { id: number; albumId: number };
export type AdminAlbum = Omit<PhotoAlbum, "id" | "photos"> & {
  id: number;
  photos: AdminPhoto[];
};
export type AdminWork = CalligraphyWork & { id: number };

export interface AdminContent {
  profile: Profile;
  projects: AdminProject[];
  albums: AdminAlbum[];
  calligraphy: AdminWork[];
}

const token = ref(sessionStorage.getItem("mysite-admin-token") || "");
export const isAuthenticated = computed(() => Boolean(token.value));

function setToken(value: string) {
  token.value = value;
  if (value) sessionStorage.setItem("mysite-admin-token", value);
  else sessionStorage.removeItem("mysite-admin-token");
}

export async function adminRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token.value) headers.Authorization = `Bearer ${token.value}`;
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`/api/admin${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== "/login") {
      setToken("");
      window.location.assign("/admin/login");
    }
    throw new Error(data.message || `请求失败 (${response.status})`);
  }
  return data as T;
}

export const adminApi = {
  async login(username: string, password: string) {
    const result = await adminRequest<{ token: string }>("/login", {
      method: "POST",
      body: { username, password },
    });
    setToken(result.token);
  },
  async logout() {
    try {
      await adminRequest("/logout", { method: "POST" });
    } finally {
      setToken("");
    }
  },
  getContent: () => adminRequest<AdminContent>("/content"),
  upload(file: File) {
    const form = new FormData();
    form.append("image", file);
    return adminRequest<{ url: string }>("/uploads", {
      method: "POST",
      body: form,
    });
  },
};

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "操作失败，请稍后重试";
}
