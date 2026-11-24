import { albums, calligraphyWorks, profile, projects } from "@shared/content";
import type {
  CalligraphyWork,
  PhotoAlbum,
  Profile,
  Project,
} from "@shared/types";

async function request<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API ${response.status}`);
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  getProfile: () => request<Profile>("/api/profile", profile),
  getProjects: () => request<Project[]>("/api/projects", projects),
  getProject: (slug: string) =>
    request<Project | null>(
      `/api/projects/${encodeURIComponent(slug)}`,
      projects.find((project) => project.slug === slug) || null,
    ),
  getAlbums: () => request<PhotoAlbum[]>("/api/albums", albums),
  getAlbum: (slug: string) =>
    request<PhotoAlbum | null>(
      `/api/albums/${encodeURIComponent(slug)}`,
      albums.find((album) => album.slug === slug) || null,
    ),
  getCalligraphy: () =>
    request<CalligraphyWork[]>("/api/calligraphy", calligraphyWorks),
};
