export interface ChapterMeta {
  so: number;
  title: string;
}

export interface Chapter extends ChapterMeta {
  content: string[];
}

export type NovelStatus = "Đang ra" | "Hoàn thành";

export interface Novel {
  id: string;
  slug: string;
  title: string;
  genre: string;
  author: string;
  image: string;
  rating: number;
  chapters: number;
  views: string;
  description: string;
  status: NovelStatus;
  featured?: boolean;
}
