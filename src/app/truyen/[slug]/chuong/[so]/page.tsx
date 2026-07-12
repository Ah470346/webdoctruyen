import { notFound } from "next/navigation";
import { getNovelBySlug } from "@/lib/data";
import { getChapter, getChapterList } from "@/lib/chapters";
import { ChapterReaderClient } from "@/components/ChapterReaderClient";

interface ChapterPageProps {
  params: Promise<{ slug: string; so: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, so: soParam } = await params;
  const so = Number(soParam);

  const novel = getNovelBySlug(slug);
  const chapter = Number.isFinite(so) ? getChapter(slug, so) : undefined;

  if (!novel || !chapter) {
    notFound();
  }

  const chapters = getChapterList(slug);

  return <ChapterReaderClient novel={novel} chapter={chapter} chapters={chapters} />;
}

