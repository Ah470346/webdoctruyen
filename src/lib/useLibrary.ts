"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface HistoryEntry {
  slug: string;
  chapterSo: number;
  updatedAt: number;
}

interface LibraryState {
  bookmarks: string[];
  history: HistoryEntry[];
}

const DEFAULT_STATE: LibraryState = { bookmarks: [], history: [] };
const MAX_HISTORY_ENTRIES = 50;

export function useLibrary() {
  const [state, setState, isLoaded] = useLocalStorage<LibraryState>(
    "library",
    DEFAULT_STATE
  );

  const toggleBookmark = useCallback(
    (slug: string) =>
      setState((s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(slug)
          ? s.bookmarks.filter((b) => b !== slug)
          : [...s.bookmarks, slug],
      })),
    [setState]
  );

  const recordProgress = useCallback(
    (slug: string, chapterSo: number) =>
      setState((s) => {
        const rest = s.history.filter((h) => h.slug !== slug);
        return {
          ...s,
          history: [
            { slug, chapterSo, updatedAt: Date.now() },
            ...rest,
          ].slice(0, MAX_HISTORY_ENTRIES),
        };
      }),
    [setState]
  );

  const isBookmarked = useCallback(
    (slug: string) => state.bookmarks.includes(slug),
    [state.bookmarks]
  );

  const getProgress = useCallback(
    (slug: string) => state.history.find((h) => h.slug === slug),
    [state.history]
  );

  return {
    bookmarks: state.bookmarks,
    history: state.history,
    isLoaded,
    toggleBookmark,
    isBookmarked,
    recordProgress,
    getProgress,
  };
}
