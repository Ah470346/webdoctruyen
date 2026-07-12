import { Novel } from "./types";
import NOVELS_DATA from "@/data/novels.json";

const NOVELS = NOVELS_DATA as Novel[];

export function getAllNovels(): Novel[] {
  return NOVELS;
}

export function getNovelBySlug(slug: string): Novel | undefined {
  return NOVELS.find((n) => n.slug === slug);
}

export function getGenres(): string[] {
  const list = new Set(NOVELS.map((n) => n.genre));
  return ["Tất cả", ...Array.from(list)];
}

export function getNovelsByGenre(genre: string): Novel[] {
  return NOVELS.filter((n) => n.genre === genre);
}

const GENRE_SLUGS: Record<string, string> = {
  "Tiên Hiệp": "tien-hiep",
  "Ngôn Tình": "ngon-tinh",
  "Khoa Huyễn": "khoa-huyen",
  "Huyền Huyễn": "huyen-huyen",
  "Đô Thị": "do-thi",
  "Dã Sử": "da-su",
};

export function getGenreSlug(genre: string): string {
  return GENRE_SLUGS[genre] ?? genre;
}

export function getGenreBySlug(slug: string): string | undefined {
  return Object.entries(GENRE_SLUGS).find(([, s]) => s === slug)?.[0];
}

export function filterNovels(query: string, genre: string): Novel[] {
  const q = query.toLowerCase();
  return NOVELS.filter((novel) => {
    const matchesSearch =
      novel.title.toLowerCase().includes(q) ||
      novel.author.toLowerCase().includes(q);
    const matchesGenre = genre === "Tất cả" || novel.genre === genre;
    return matchesSearch && matchesGenre;
  });
}

export function getFeaturedNovel(): Novel {
  return NOVELS.find((n) => n.featured) ?? NOVELS[0];
}

