"use client";

import Image from "next/image";
import Link from "next/link";
import { Novel } from "@/lib/types";

interface NovelCardProps {
  novel: Novel;
  isBookmarked: boolean;
  onToggleBookmark: (slug: string) => void;
}

export function NovelCard({ novel, isBookmarked, onToggleBookmark }: NovelCardProps) {
  return (
    <div className="novel-card">
      <Link href={`/truyen/${novel.slug}`} className="card-image-box">
        <Image
          src={novel.image}
          alt={`Bìa truyện ${novel.title}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
          className="card-cover"
        />
        <div className="card-overlay">
          <span className="badge-chapter-overlay">{novel.chapters} Ch.</span>
        </div>
        <div className="card-rating-float">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          {novel.rating}
        </div>
      </Link>
      <div className="novel-info">
        <Link href={`/truyen/${novel.slug}`}>
          <h3 className="novel-title">{novel.title}</h3>
        </Link>
        <div className="novel-meta-row">
          <span className="novel-genre">{novel.genre}</span>
          <button
            onClick={() => onToggleBookmark(novel.slug)}
            aria-label={isBookmarked ? "Bỏ lưu truyện" : "Lưu truyện"}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: isBookmarked ? "var(--accent-primary)" : "var(--text-muted)",
              transition: "var(--transition-smooth)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "2px",
          }}
        >
          <span>{novel.views} lượt xem</span>
          <span
            style={{
              color: novel.status === "Đang ra" ? "#34d399" : "var(--text-muted)",
            }}
          >
            {novel.status}
          </span>
        </div>
      </div>
    </div>
  );
}
