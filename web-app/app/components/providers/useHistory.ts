"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoryItem } from "../HistoryRail";

const STORAGE_KEY = "humanise-history";
const MAX_ENTRIES = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
    setLoaded(true);
  }, []);

  // Save on change (after initial load)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, loaded]);

  const addEntry = useCallback((entry: Omit<HistoryItem, "id" | "timestamp" | "preview">) => {
    const newItem: HistoryItem = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      preview: entry.output.slice(0, 80).trim() + (entry.output.length > 80 ? "…" : ""),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, MAX_ENTRIES));
    return newItem.id;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearAll };
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(timestamp).toLocaleDateString();
}
