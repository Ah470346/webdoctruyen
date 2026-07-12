"use client";

import { useEffect } from "react";
import { useReaderPrefs } from "@/lib/useReaderPrefs";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { prefs, isLoaded } = useReaderPrefs();

  useEffect(() => {
    if (!isLoaded) return;
    document.documentElement.setAttribute("data-theme", prefs.theme);
  }, [prefs.theme, isLoaded]);

  return <>{children}</>;
}
