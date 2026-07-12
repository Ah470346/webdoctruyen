"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type ReaderTheme = "dark" | "light";
export type ReaderFontFamily =
  | "sans"
  | "vietnamese"
  | "serif"
  | "noto-serif"
  | "lora"
  | "merriweather"
  | "mono";

export interface ReaderPrefs {
  fontSize: number;
  lineHeight: number;
  fontFamily: ReaderFontFamily;
  theme: ReaderTheme;
  bgColor?: string | null;
  textColor?: string | null;
}

const DEFAULT_PREFS: ReaderPrefs = {
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: "sans",
  theme: "dark",
  bgColor: null,
  textColor: null,
};

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 28;
const FONT_STEP = 2;

export const FONT_FAMILY_PRESETS: { id: ReaderFontFamily; label: string; value: string }[] = [
  { id: "sans", label: "Mặc Định (Plus Jakarta Sans)", value: "var(--font-sans)" },
  { id: "vietnamese", label: "Be Vietnam Pro", value: "var(--font-vietnamese)" },
  { id: "serif", label: "Playfair Display", value: "var(--font-serif)" },
  { id: "noto-serif", label: "Noto Serif", value: "var(--font-noto-serif)" },
  { id: "lora", label: "Lora", value: "var(--font-lora)" },
  { id: "merriweather", label: "Merriweather", value: "var(--font-merriweather)" },
  { id: "mono", label: "Monospace", value: "var(--font-mono)" },
];

export const LINE_HEIGHT_PRESETS = [
  { id: "tight", label: "Chặt", value: 1.4 },
  { id: "normal", label: "Vừa", value: 1.8 },
  { id: "loose", label: "Rộng", value: 2.2 },
];

export const BG_COLOR_PRESETS = [
  { id: "dark", label: "Tối", value: "#09090b" },
  { id: "light", label: "Sáng", value: "#fdfdfd" },
  { id: "sepia", label: "Sepia", value: "#f1e7d0" },
  { id: "green", label: "Xanh lá", value: "#d7e8d0" },
  { id: "gray", label: "Xám", value: "#2b2b2b" },
];

export const TEXT_COLOR_PRESETS = [
  { id: "white", label: "Trắng", value: "#fafafa" },
  { id: "black", label: "Đen", value: "#18181b" },
  { id: "gray", label: "Xám", value: "#a1a1aa" },
  { id: "brown", label: "Nâu", value: "#3b2f22" },
  { id: "amber", label: "Hổ phách", value: "#8b6b3d" },
];

export function useReaderPrefs() {
  const [prefs, setPrefs, isLoaded] = useLocalStorage<ReaderPrefs>(
    "reader-prefs",
    DEFAULT_PREFS
  );

  const increaseFontSize = useCallback(
    () =>
      setPrefs((p) => ({
        ...p,
        fontSize: Math.min(MAX_FONT_SIZE, p.fontSize + FONT_STEP),
      })),
    [setPrefs]
  );

  const decreaseFontSize = useCallback(
    () =>
      setPrefs((p) => ({
        ...p,
        fontSize: Math.max(MIN_FONT_SIZE, p.fontSize - FONT_STEP),
      })),
    [setPrefs]
  );

  const toggleTheme = useCallback(
    () =>
      setPrefs((p) => ({
        ...p,
        theme: p.theme === "dark" ? "light" : "dark",
      })),
    [setPrefs]
  );

  const setBgColor = useCallback(
    (bgColor: string | null) => setPrefs((p) => ({ ...p, bgColor })),
    [setPrefs]
  );

  const setTextColor = useCallback(
    (textColor: string | null) => setPrefs((p) => ({ ...p, textColor })),
    [setPrefs]
  );

  const resetColors = useCallback(
    () => setPrefs((p) => ({ ...p, bgColor: null, textColor: null })),
    [setPrefs]
  );

  const setFontFamily = useCallback(
    (fontFamily: ReaderFontFamily) => setPrefs((p) => ({ ...p, fontFamily })),
    [setPrefs]
  );

  const setLineHeight = useCallback(
    (lineHeight: number) => setPrefs((p) => ({ ...p, lineHeight })),
    [setPrefs]
  );

  return {
    prefs,
    isLoaded,
    increaseFontSize,
    decreaseFontSize,
    toggleTheme,
    setBgColor,
    setTextColor,
    resetColors,
    setFontFamily,
    setLineHeight,
    canIncreaseFontSize: prefs.fontSize < MAX_FONT_SIZE,
    canDecreaseFontSize: prefs.fontSize > MIN_FONT_SIZE,
  };
}
