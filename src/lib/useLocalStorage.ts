"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "local-storage-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): string | null | undefined {
  return undefined;
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const getSnapshot = useCallback((): string | null | undefined => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoaded = raw !== undefined;

  let value = defaultValue;
  if (isLoaded && raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = defaultValue;
    }
  }

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      let current = defaultValue;
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) current = JSON.parse(raw) as T;
      } catch {
        // corrupted/unavailable storage, fall back to default
      }
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // storage unavailable (e.g. private mode quota) - ignore
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key, defaultValue]
  );

  return [value, update, isLoaded] as const;
}
