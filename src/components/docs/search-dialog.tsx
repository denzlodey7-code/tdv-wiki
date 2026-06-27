"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, Command } from "lucide-react";
import type { NavSection } from "@/lib/mdx-utils";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
  navigation: NavSection[];
}

export default function SearchDialog({
  open,
  onClose,
  onNavigate,
  navigation,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten all pages for search (include snippet for content search)
  const allPages = navigation.flatMap((section) =>
    section.items.map((item) => ({
      slug: item.slug,
      title: item.title,
      section: section.title,
      snippet: item.snippet || "",
    })),
  );

  const filtered = query
    ? allPages.filter((page) => {
        const q = query.toLowerCase();
        return (
          page.title.toLowerCase().includes(q) ||
          page.section.toLowerCase().includes(q) ||
          page.slug.toLowerCase().includes(q) ||
          page.snippet.toLowerCase().includes(q)
        );
      })
    : allPages;

  const handleNavigate = useCallback(
    (slug: string) => {
      onNavigate(slug);
      onClose();
    },
    [onNavigate, onClose],
  );

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset selected index when query changes
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        setSelectedIndex((current) => {
          if (filtered[current]) {
            handleNavigate(filtered[current].slug);
          }
          return current;
        });
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, handleNavigate, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="border-border bg-background relative mx-4 w-full max-w-[560px] overflow-hidden rounded-xl border shadow-2xl">
        <div className="border-border flex items-center border-b px-4">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search documentation..."
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent px-3 py-3.5 text-[var(--text-md)] outline-none"
          />
          <kbd className="bg-muted text-muted-foreground hidden items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] sm:flex">
            ESC
          </kbd>
        </div>
        <div className="max-h-[400px] scrollbar-thin overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              Ничего не найдено
            </div>
          ) : (
            filtered.map((page, idx) => (
              <button
                key={page.slug}
                onClick={() => handleNavigate(page.slug)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex w-full items-center px-4 py-2.5 text-left transition-colors ${
                  idx === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate text-[var(--text-base)]">
                    {page.title}
                  </div>
                  <div className="text-muted-foreground truncate text-[12px]">
                    {page.section}
                  </div>
                </div>
                {idx === selectedIndex && (
                  <span className="text-muted-foreground ml-2 shrink-0 text-[11px]">
                    Enter
                  </span>
                )}
              </button>
            ))
          )}
        </div>
        <div className="border-border text-muted-foreground flex items-center gap-4 border-t px-4 py-2.5 text-[11px]">
          <span className="flex items-center gap-1">
            <kbd className="bg-muted rounded px-1 py-0.5">Up/Dn</kbd> навигация
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-muted rounded px-1 py-0.5">Enter</kbd> открыть
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-muted rounded px-1 py-0.5">esc</kbd> закрыть
          </span>
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="text-[var(--text-sm)]">Search</span>
      <kbd className="text-muted-foreground ml-2 hidden items-center gap-0.5 text-[11px] sm:flex">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  );
}
