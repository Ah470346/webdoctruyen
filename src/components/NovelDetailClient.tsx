"use client";

import Image from "next/image";
import Link from "next/link";
import { useLibrary } from "@/lib/useLibrary";
import { Novel, ChapterMeta } from "@/lib/types";

interface Props {
  novel: Novel;
  chapters: ChapterMeta[];
}

export function NovelDetailClient({ novel, chapters }: Props) {
  const { toggleBookmark, isBookmarked, getProgress } = useLibrary();
  const progress = getProgress(novel.slug);
  const continueHref = `/truyen/${novel.slug}/chuong/${progress?.chapterSo ?? 1}`;
  const bookmarked = isBookmarked(novel.slug);

  return (
    <main className="container" style={{ padding: "40px 0" }}>
      <div className="novel-detail-header">
        <Image
          src={novel.image}
          alt={`Bìa truyện ${novel.title}`}
          width={220}
          height={330}
          className="novel-detail-cover"
          priority
        />
        <div className="novel-detail-info">
          <span className="badge-tag">{novel.genre}</span>
          <h1 className="novel-detail-title">{novel.title}</h1>
          <div className="hero-meta">
            <div className="meta-item rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>{novel.rating}</span>
            </div>
            <div className="divider"></div>
            <div className="meta-item">
              <span>Tác giả: {novel.author}</span>
            </div>
            <div className="divider"></div>
            <div className="meta-item">
              <span>{chapters.length} chương</span>
            </div>
            <div className="divider"></div>
            <div className="meta-item">
              <span style={{ color: novel.status === "Đang ra" ? "#34d399" : "var(--text-muted)" }}>
                {novel.status}
              </span>
            </div>
          </div>
          <p className="novel-detail-desc">{novel.description}</p>
          <div className="hero-ctas">
            <Link href={continueHref} className="btn-primary">
              {progress ? `Đọc Tiếp - Chương ${progress.chapterSo}` : "Đọc Từ Đầu"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <button className="btn-secondary" onClick={() => toggleBookmark(novel.slug)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: bookmarked ? "var(--accent-primary)" : "inherit" }}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              {bookmarked ? "Đã Lưu" : "Lưu Vào Tủ Sách"}
            </button>
          </div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: "48px" }}>
        <h2 className="section-title">Danh Sách Chương</h2>
      </div>
      <div className="novel-chapter-grid">
        {chapters.map((c) => (
          <Link
            key={c.so}
            href={`/truyen/${novel.slug}/chuong/${c.so}`}
            className={`reader-chapter-item${progress?.chapterSo === c.so ? " active" : ""}`}
          >
            {c.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
