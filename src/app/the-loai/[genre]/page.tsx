"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { NovelCard } from "@/components/NovelCard";
import { getGenreBySlug, getNovelsByGenre } from "@/lib/data";
import { useLibrary } from "@/lib/useLibrary";

interface GenrePageProps {
  params: Promise<{ genre: string }>;
}

export default function GenrePage({ params }: GenrePageProps) {
  const { genre: genreSlug } = use(params);
  const genreName = getGenreBySlug(genreSlug);

  if (!genreName) {
    notFound();
  }

  const novels = getNovelsByGenre(genreName);
  const { toggleBookmark, isBookmarked } = useLibrary();

  return (
    <>
      <Header />
      <main className="container" style={{ padding: "40px 0" }}>
        <div className="section-header">
          <h1 className="section-title">Thể Loại: {genreName}</h1>
        </div>
        {novels.length === 0 ? (
          <div className="library-empty">Chưa có truyện nào thuộc thể loại này.</div>
        ) : (
          <div className="novels-grid">
            {novels.map((novel) => (
              <NovelCard
                key={novel.id}
                novel={novel}
                isBookmarked={isBookmarked(novel.slug)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
