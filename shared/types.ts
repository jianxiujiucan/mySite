export interface Profile {
  name: string;
  englishName: string;
  avatar: string;
  introduction: string[];
}

export interface Project {
  id?: number;
  slug: string;
  title: string;
  english: string;
  summary: string;
  description: string;
  image: string;
  features: string[];
  relatedRoute: string;
  relatedLabel: string;
}

export interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  description?: string;
  thumbnailSrc?: string;
}

export interface PhotoAlbum {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  photos: Photo[];
}

export interface CalligraphyWork {
  id?: number;
  slug: string;
  title: string;
  src: string;
  alt: string;
  ratio: string;
  description?: string;
}
