import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getNovelBySlug } from "@/lib/data";
import { getChapterList } from "@/lib/chapters";
import { NovelDetailClient } from "@/components/NovelDetailClient";

interface NovelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { slug } = await params;
  const novel = getNovelBySlug(slug);

  if (!novel) {
    notFound();
  }

  const chapters = getChapterList(slug);

  return (
    <>
      <Header />
      <NovelDetailClient novel={novel} chapters={chapters} />
    </>
  );
}

