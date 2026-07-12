import { Chapter, ChapterMeta } from "./types";
import fs from "fs";
import path from "path";

function loadChapters(slug: string): Chapter[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "chapters", `${slug}.json`);
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as Chapter[];
  } catch (error) {
    return [];
  }
}

export function getChapterList(slug: string): ChapterMeta[] {
  return loadChapters(slug).map(({ so, title }) => ({ so, title }));
}

export function getChapterCount(slug: string): number {
  return loadChapters(slug).length;
}

export function getChapter(slug: string, so: number): Chapter | undefined {
  return loadChapters(slug).find((c) => c.so === so);
}

