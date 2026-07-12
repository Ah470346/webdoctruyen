"use client";

import Link from "next/link";

interface ReaderNavProps {
  novelSlug: string;
  currentSo: number;
  maxSo: number;
}

export function ReaderNav({ novelSlug, currentSo, maxSo }: ReaderNavProps) {
  const hasPrev = currentSo > 1;
  const hasNext = currentSo < maxSo;

  return (
    <div className="reader-nav">
      {hasPrev ? (
        <Link
          href={`/truyen/${novelSlug}/chuong/${currentSo - 1}`}
          className="btn-secondary reader-nav-btn"
        >
          Chương Trước
        </Link>
      ) : (
        <span className="btn-secondary reader-nav-btn reader-nav-btn-disabled">
          Chương Trước
        </span>
      )}

      <Link href={`/truyen/${novelSlug}`} className="btn-icon" aria-label="Về trang truyện">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
      </Link>

      {hasNext ? (
        <Link
          href={`/truyen/${novelSlug}/chuong/${currentSo + 1}`}
          className="btn-primary reader-nav-btn"
        >
          Chương Sau
        </Link>
      ) : (
        <span className="btn-primary reader-nav-btn reader-nav-btn-disabled">
          Chương Sau
        </span>
      )}
    </div>
  );
}
