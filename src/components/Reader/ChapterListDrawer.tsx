"use client";

import Link from "next/link";
import { ChapterMeta } from "@/lib/types";

interface ChapterListDrawerProps {
  novelSlug: string;
  chapters: ChapterMeta[];
  currentSo: number;
  onClose: () => void;
}

export function ChapterListDrawer({
  novelSlug,
  chapters,
  currentSo,
  onClose,
}: ChapterListDrawerProps) {
  return (
    <div className="reader-sheet-backdrop" onClick={onClose}>
      <div className="reader-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="reader-sheet-handle" />
        <h3 className="reader-sheet-title">Mục Lục ({chapters.length} chương)</h3>
        <div className="reader-chapter-list">
          {chapters.map((c) => (
            <Link
              key={c.so}
              href={`/truyen/${novelSlug}/chuong/${c.so}`}
              className={`reader-chapter-item${c.so === currentSo ? " active" : ""}`}
              onClick={onClose}
            >
              {c.title.split(":")[0]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
