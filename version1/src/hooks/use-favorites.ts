"use client";

import { useSyncExternalStore } from "react";

const key = "arenax-preview-favorites";
const listeners = new Set<() => void>();
let memory = "[]";

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
function snapshot() {
  try { return window.localStorage.getItem(key) ?? "[]"; }
  catch { return memory; }
}
function parse(value: string): string[] {
  try {
    const ids: unknown = JSON.parse(value);
    return Array.isArray(ids) ? [...new Set(ids.filter((id): id is string => typeof id === "string"))] : [];
  } catch { return []; }
}
function save(ids: string[]) {
  memory = JSON.stringify(ids);
  try { window.localStorage.setItem(key, memory); } catch { /* Retain this tab's state if storage is unavailable. */ }
  listeners.forEach((listener) => listener());
}

export function useFavorites() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return {
    favoriteIds: parse(value),
    toggleFavorite(id: string) {
      const ids = parse(snapshot());
      save(ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id]);
    },
    removeFavorite(id: string) {
      save(parse(snapshot()).filter((entry) => entry !== id));
    },
  };
}
