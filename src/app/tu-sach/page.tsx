"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { NovelCard } from "@/components/NovelCard";
import { getNovelBySlug } from "@/lib/data";
import { Novel } from "@/lib/types";
import { HistoryEntry, useLibrary } from "@/lib/useLibrary";

export default function LibraryPage() {
  const { bookmarks, history, toggleBookmark, isLoaded } = useLibrary();

  const bookmarkedNovels = bookmarks
    .map((slug) => getNovelBySlug(slug))
    .filter((novel): novel is Novel => novel !== undefined);

  const historyEntries = history
    .map((entry) => {
      const novel = getNovelBySlug(entry.slug);
      return novel ? { novel, entry } : null;
    })
    .filter(
      (item): item is { novel: Novel; entry: HistoryEntry } => item !== null
    );

  return (
    <>
      <Header />
      <main className="container library-section">
        <div className="section-header">
          <h1 className="section-title">Tủ Sách Của Bạn</h1>
        </div>

        {isLoaded && bookmarkedNovels.length === 0 ? (
          <div className="library-empty">
            Bạn chưa lưu truyện nào. Nhấn biểu tượng bookmark trên trang truyện để lưu lại!
          </div>
        ) : (
          <div className="novels-grid">
            {bookmarkedNovels.map((novel) => (
              <NovelCard
                key={novel.id}
                novel={novel}
                isBookmarked
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

        <div className="section-header" style={{ marginTop: "48px" }}>
          <h2 className="section-title">Lịch Sử Đọc</h2>
        </div>

        {isLoaded && historyEntries.length === 0 ? (
          <div className="library-empty">Chưa có lịch sử đọc truyện nào.</div>
        ) : (
          <div className="history-list">
            {historyEntries.map(({ novel, entry }) => (
              <Link
                key={novel.slug}
                href={`/truyen/${novel.slug}/chuong/${entry.chapterSo}`}
                className="ranking-item"
              >
                <Image
                  src={novel.image}
                  alt={`Bìa ${novel.title}`}
                  width={48}
                  height={64}
                  className="rank-cover"
                />
                <div className="rank-details">
                  <h4 className="rank-title">{novel.title}</h4>
                  <div className="rank-meta">
                    <span className="badge-tag">Chương {entry.chapterSo}</span>
                    <span>{new Date(entry.updatedAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
