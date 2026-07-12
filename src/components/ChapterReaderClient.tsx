"use client";

import { useEffect, useState } from "react";
import { ReaderToolbar } from "@/components/Reader/ReaderToolbar";
import { ReaderNav } from "@/components/Reader/ReaderNav";
import { ReaderSettings } from "@/components/Reader/ReaderSettings";
import { ChapterListDrawer } from "@/components/Reader/ChapterListDrawer";
import { useReaderPrefs } from "@/lib/useReaderPrefs";
import { useLibrary } from "@/lib/useLibrary";
import { Novel, Chapter, ChapterMeta } from "@/lib/types";

interface Props {
  novel: Novel;
  chapter: Chapter;
  chapters: ChapterMeta[];
}

export function ChapterReaderClient({ novel, chapter, chapters }: Props) {
  const { recordProgress } = useLibrary();
  const {
    prefs,
    increaseFontSize,
    decreaseFontSize,
    toggleTheme,
    setBgColor,
    setTextColor,
    resetColors,
    canIncreaseFontSize,
    canDecreaseFontSize,
  } = useReaderPrefs();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chapterListOpen, setChapterListOpen] = useState(false);

  useEffect(() => {
    recordProgress(novel.slug, chapter.so);
  }, [novel.slug, chapter.so, recordProgress]);

  return (
    <div
      className="reader-page"
      style={
        {
          "--reader-font-size": `${prefs.fontSize}px`,
          "--reader-line-height": prefs.lineHeight,
          ...(prefs.bgColor ? { "--reader-bg-color": prefs.bgColor } : {}),
          ...(prefs.textColor
            ? { "--reader-text-color": prefs.textColor }
            : {}),
        } as React.CSSProperties
      }
    >
      <ReaderToolbar
        novelSlug={novel.slug}
        novelTitle={novel.title}
        chapterTitle={chapter.title}
        onOpenChapterList={() => setChapterListOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <article className="reader-content">
        <h1 className="reader-content-title">{chapter.title}</h1>
        {chapter.content.map((paragraph, i) => (
          <p key={i} className="reader-paragraph">
            {paragraph}
          </p>
        ))}
      </article>

      <ReaderNav novelSlug={novel.slug} currentSo={chapter.so} maxSo={chapters.length} />

      {settingsOpen && (
        <ReaderSettings
          fontSize={prefs.fontSize}
          canIncrease={canIncreaseFontSize}
          canDecrease={canDecreaseFontSize}
          theme={prefs.theme}
          bgColor={prefs.bgColor ?? null}
          textColor={prefs.textColor ?? null}
          onIncrease={increaseFontSize}
          onDecrease={decreaseFontSize}
          onToggleTheme={toggleTheme}
          onSetBgColor={setBgColor}
          onSetTextColor={setTextColor}
          onResetColors={resetColors}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {chapterListOpen && (
        <ChapterListDrawer
          novelSlug={novel.slug}
          chapters={chapters}
          currentSo={chapter.so}
          onClose={() => setChapterListOpen(false)}
        />
      )}
    </div>
  );
}
